'use client'

// vendors
import { useState } from 'react'
import { enqueueSnackbar } from 'notistack'
import myAxios from '@/lib/axios'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import DeleteIcon from '@mui/icons-material/Delete'

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
                color="error"
                edge="end"
                aria-label="Hapus"
                loading={isDeleting}
                disabled={isDisabled || isDeleting}
                onClick={() => handleDelete()}>
                <DeleteIcon />
            </IconButton>
        </Tooltip>
    )
}
