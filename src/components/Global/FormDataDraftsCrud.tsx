// types

// icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import DeleteIcon from '@mui/icons-material/Delete'
import EditNoteIcon from '@mui/icons-material/EditNote'
import SaveAsIcon from '@mui/icons-material/SaveAs'
// materials
import Badge from '@mui/material/Badge'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import { enqueueSnackbar } from 'notistack'
import type { MouseEvent } from 'react'
// vendors
import { useEffect, useState } from 'react'
// utils
import { dbPromise } from '@/lib/idb'
// hooks
import useFormData from '@/providers/useFormData'

interface DraftType {
    id?: IDBValidKey
    modelName: string
    nameId: string | number
    data: {
        [key: string]: string | number
    }
}

export default function FormDataDraftsCrud({
    modelName,
    dataKeyForNameId,
    nameIdFormatter = nameId => nameId as string,
}: {
    modelName: string
    dataKeyForNameId: string
    nameIdFormatter?: (nameId: string | number) => string
}) {
    const { data, handleEdit, loading, isDirty, handleCreate } =
        useFormData<DraftType['data']>()

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
    }, [modelName])

    const handleSaveAsDraft = () => {
        if (!currDataNameId)
            return enqueueSnackbar(`${dataKeyForNameId} tidak boleh kosong`, {
                autoHideDuration: 10000,
                variant: 'error',
            })

        return dbPromise.then(db => {
            const newDraft: DraftType = {
                data: data,
                modelName,
                nameId: currDataNameId,
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
                                autoHideDuration: 10000,
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

    const handleSelect = (draft: DraftType) => {
        setDraft(draft)
        handleEdit(draft.data)
        handleClose()
    }

    return (
        <div>
            <Box alignItems="center" display="flex">
                <Tooltip placement="top" title="Hapus draf">
                    <span>
                        <IconButton
                            color="error"
                            disabled={!draft || loading}
                            onClick={handleDelete}
                            size="small">
                            <DeleteIcon />
                        </IconButton>
                    </span>
                </Tooltip>

                <Badge
                    anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top',
                    }}
                    badgeContent={drafts.length}
                    color="warning">
                    <Button
                        disabled={drafts.length === 0 || loading}
                        endIcon={<ArrowDropDownIcon />}
                        onClick={drafts.length === 0 ? undefined : handleClick}
                        size="small">
                        {draft
                            ? draft.nameId
                            : drafts.length === 0
                              ? 'Tidak ada draf tersimpan'
                              : 'Pilih draf'}
                    </Button>
                </Badge>

                <Tooltip placement="top" title="Simpan sebagai draf">
                    <span>
                        <IconButton
                            color="warning"
                            disabled={!isDirty || loading}
                            onClick={handleSaveAsDraft}
                            size="small">
                            <SaveAsIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Box>

            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom',
                }}
                aria-labelledby="demo-positioned-button"
                id="demo-positioned-menu"
                onClose={handleClose}
                open={Boolean(anchorEl)}
                transformOrigin={{
                    horizontal: 'center',
                    vertical: 'top',
                }}>
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
                {drafts.map(draftOnIdb => (
                    <MenuItem
                        disabled={
                            loading || draftOnIdb.nameId === draft?.nameId
                        }
                        key={draftOnIdb.nameId}
                        onClick={() => handleSelect(draftOnIdb)}
                        selected={draftOnIdb.nameId === draft?.nameId}>
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
