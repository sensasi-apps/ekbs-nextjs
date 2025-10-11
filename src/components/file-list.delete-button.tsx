'use client'

// icons
import DeleteIcon from '@mui/icons-material/Delete'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { enqueueSnackbar } from 'notistack'
// vendors
import { useState } from 'react'
import myAxios from '@/lib/axios'

export default function FileListDeleteButton({
    uuidFileName,
}: {
    uuidFileName: string
}) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [isDisabled, setIsDisabled] = useState(false)

    function handleDelete() {
        if (!isDeleting) {
            setIsDeleting(true)

            myAxios
                .delete(`/file/${uuidFileName}`)
                .then(() => {
                    enqueueSnackbar('Berkas berhasil dihapus', {
                        variant: 'success',
                    })

                    setIsDisabled(true)
                })
                .catch(() => {
                    enqueueSnackbar('Gagal menghapus berkas', {
                        variant: 'error',
                    })
                })
                .finally(() => {
                    setIsDeleting(false)
                })
        }
    }

    return (
        <Tooltip title="Hapus">
            <IconButton
                aria-label="Hapus"
                color="error"
                disabled={isDisabled || isDeleting}
                edge="end"
                loading={isDeleting}
                onClick={() => handleDelete()}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}
