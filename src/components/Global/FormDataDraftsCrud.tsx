import type { MouseEvent } from 'react'

import { FC, useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'

import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteIcon from '@mui/icons-material/Delete'

import useFormData from '@/providers/useFormData'
import { dbPromise } from '@/lib/idb'
import { Divider, Tooltip } from '@mui/material'

interface DraftType {
    id?: IDBValidKey
    modelName: string
    nameId: string | number
    data: any
}

const FormDataDraftsCrud: FC<{
    modelName: string
    dataKeyForNameId: string
    nameIdFormatter?: (nameId: any) => any
}> = ({ modelName, dataKeyForNameId, nameIdFormatter = nameId => nameId }) => {
    const { data, handleEdit, loading, isDirty, handleCreate } = useFormData<{
        [key: string]: string | number
    }>()

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [drafts, setDrafts] = useState<DraftType[]>([])
    const [draft, setDraft] = useState<DraftType | undefined>()

    const currDataNameId = nameIdFormatter(data?.[dataKeyForNameId])

    const handleClick = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    useEffect(() => {
        dbPromise.then(db =>
            db
                .getAllFromIndex('formDataDrafts', 'modelName', modelName)
                .then(setDrafts),
        )
    }, [])

    const handleSaveAsDraft = () => {
        if (!currDataNameId)
            return enqueueSnackbar(`${dataKeyForNameId} tidak boleh kosong`, {
                variant: 'error',
            })

        return dbPromise.then(db => {
            const newDraft: DraftType = {
                modelName,
                nameId: currDataNameId,
                data: data,
            }

            if (draft?.id) newDraft.id = draft.id

            db.put('formDataDrafts', newDraft)
                .then(id => {
                    const savedDraft = { ...newDraft, id }

                    handleEdit(savedDraft.data)

                    setDraft(savedDraft)

                    if (draft?.id) {
                        setDrafts(prev =>
                            prev.map(d => (d.id === draft.id ? savedDraft : d)),
                        )
                    } else {
                        setDrafts(prev => [...prev, savedDraft])
                    }
                })
                .catch(error => {
                    if (error.name === 'ConstraintError') {
                        return enqueueSnackbar(
                            `Operasi gagal, data ${currDataNameId} sudah ada pada draft`,
                            {
                                variant: 'warning',
                            },
                        )
                    }

                    throw error
                })
        })
    }

    const handleDelete = () => {
        if (!draft?.id) return

        const draftId = draft.id

        return dbPromise.then(db =>
            db.delete('formDataDrafts', draftId).then(() => {
                setDrafts(prev => {
                    setDraft(undefined)
                    return prev.filter(d => d.id !== draftId)
                })
                handleCreate()
            }),
        )
    }

    const handleSelect = (draft: any) => {
        setDraft(draft)
        handleEdit(draft.data)
        handleClose()
    }

    return (
        <div>
            <Box display="flex" alignItems="center" gap={1}>
                <Tooltip title="Hapus draf" placement="top">
                    <span>
                        <IconButton
                            color="error"
                            size="small"
                            onClick={handleDelete}
                            disabled={!Boolean(draft) || loading}>
                            <DeleteIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Badge
                    badgeContent={drafts.length}
                    color="warning"
                    anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top',
                    }}>
                    <Button
                        onClick={drafts.length === 0 ? undefined : handleClick}
                        disabled={drafts.length === 0 || loading}
                        endIcon={<ArrowDropDownIcon />}
                        size="small">
                        {draft
                            ? draft.nameId
                            : drafts.length === 0
                            ? 'Tidak ada draf tersimpan'
                            : 'Pilih draf'}
                    </Button>
                </Badge>

                <Tooltip title="Simpan sebagai draf" placement="top">
                    <span>
                        <IconButton
                            size="small"
                            onClick={handleSaveAsDraft}
                            color="warning"
                            disabled={!isDirty || loading}>
                            <SaveAsIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                onClose={handleClose}>
                <MenuItem
                    disabled={loading || (!isDirty && !draft)}
                    onClick={() => {
                        handleCreate()
                        handleClose()
                        setDraft(undefined)
                    }}>
                    <ListItemText>Buat Data Baru</ListItemText>
                </MenuItem>
                <Divider />
                {drafts.map((draftOnIdb, i) => (
                    <MenuItem
                        key={i}
                        selected={draftOnIdb.nameId === draft?.nameId}
                        disabled={
                            loading || draftOnIdb.nameId === draft?.nameId
                        }
                        onClick={() => handleSelect(draftOnIdb)}>
                        <ListItemIcon>
                            <EditNoteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>{draftOnIdb.nameId}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    )
}

export default FormDataDraftsCrud
