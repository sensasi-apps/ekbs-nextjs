// types
import type { MouseEvent } from 'react'
// vendors
import { useEffect, useState } from 'react'
import { enqueueSnackbar } from 'notistack'
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
// icons
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import EditNoteIcon from '@mui/icons-material/EditNote'
import DeleteIcon from '@mui/icons-material/Delete'
// hooks
import useFormData from '@/providers/useFormData'
// utils
import { dbPromise } from '@/lib/idb'

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
                variant: 'error',
                autoHideDuration: 10000,
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
                                autoHideDuration: 10000,
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
            <Box display="flex" alignItems="center">
                <Tooltip title="Hapus draf" placement="top">
                    <span>
                        <IconButton
                            color="error"
                            size="small"
                            onClick={handleDelete}
                            disabled={!draft || loading}>
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
