import type { AxiosError } from 'axios'
// types
import type FileFromDb from '@/dataTypes/File'
// vendors
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
// icons-materials
import CloseIcon from '@mui/icons-material/Close'

export default function ImageButtonAndModal({
    alt,
    file,
    disabled,
}: {
    alt: string
    file: FileFromDb | File
    disabled?: boolean
}) {
    const [open, setOpen] = useState(false)
    const [fileCreatedUrl, setFileCreatedUrl] = useState<string | null>(null)

    function handleClose() {
        setOpen(false)
    }

    useEffect(() => {
        if (file instanceof File) {
            setFileCreatedUrl(prev => {
                if (prev) {
                    URL.revokeObjectURL(prev)
                }

                return URL.createObjectURL(file)
            })
        } else {
            axios
                .get(`file/${file.uuid}.${file.extension}`, {
                    responseType: 'blob',
                })
                .then(res =>
                    setFileCreatedUrl(prev => {
                        if (prev) {
                            URL.revokeObjectURL(prev)
                        }

                        return URL.createObjectURL(res.data)
                    }),
                )
                .catch(({ status }: AxiosError) => {
                    if (status === 422) {
                        enqueueSnackbar('Gagal memuat gambar: ' + file.alias, {
                            variant: 'error',
                        })
                    }
                })
        }
    }, [file])

    useEffect(() => {
        return () => {
            if (fileCreatedUrl) {
                URL.revokeObjectURL(fileCreatedUrl)
            }
        }
    }, [fileCreatedUrl])

    return (
        <>
            <Box display="flex" justifyContent="center">
                {fileCreatedUrl ? (
                    <Button
                        disabled={disabled}
                        onClick={() => setOpen(true)}
                        size="small"
                        color="inherit"
                        sx={{
                            p: 0,
                        }}>
                        <img // eslint-disable-line
                            src={fileCreatedUrl}
                            alt={alt}
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '4px',
                                maxHeight: '200px',
                            }}
                        />
                    </Button>
                ) : (
                    <Skeleton variant="rounded" width={160} height={90} />
                )}
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <CloseIconButton onClick={handleClose} />

                {fileCreatedUrl && (
                    <img // eslint-disable-line
                        src={fileCreatedUrl}
                        alt={alt}
                        style={{ width: '100%', height: 'auto' }}
                    />
                )}
            </Dialog>
        </>
    )
}

function CloseIconButton({ onClick }: { onClick: () => void }) {
    return (
        <IconButton
            onClick={onClick}
            size="small"
            color="error"
            sx={{
                position: 'absolute',
                top: '0',
                right: '0',
            }}>
            <CloseIcon />
        </IconButton>
    )
}
