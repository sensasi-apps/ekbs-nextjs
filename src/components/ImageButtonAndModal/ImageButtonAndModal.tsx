// types
import type File from '@/dataTypes/File'
// vendors
import { useState } from 'react'
import Image from 'next/image'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'

export default function ImageButtonAndModal({
    alt,
    file,
}: {
    alt?: string
    file: File
}) {
    const [open, setOpen] = useState(false)

    const handleClose = () => setOpen(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} size="small" color="inherit">
                <Image
                    unoptimized
                    width={0}
                    height={0}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${file.uuid}.${file.extension}`}
                    style={{ width: '100%', height: 'auto' }}
                    alt={alt ?? 'Gambar'}
                />
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <IconButton
                    onClick={handleClose}
                    size="small"
                    color="error"
                    sx={{
                        position: 'absolute',
                        top: '0',
                        right: '0',
                    }}>
                    <CloseIcon />
                </IconButton>
                <Image
                    unoptimized
                    width={0}
                    height={0}
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${file.uuid}.${file.extension}`}
                    style={{ width: '100%', height: 'auto' }}
                    alt={alt ?? 'Gambar'}
                />
            </Dialog>
        </>
    )
}
