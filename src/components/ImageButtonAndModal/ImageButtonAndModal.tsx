// icons-materials
import CloseIcon from '@mui/icons-material/Close'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import type { AxiosError } from 'axios'
// vendors
import { enqueueSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'
// types
import type FileFromDb from '@/types/orms/file'

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
                        enqueueSnackbar(`Gagal memuat gambar: ${file.alias}`, {
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
                        color="inherit"
                        disabled={disabled}
                        onClick={() => setOpen(true)}
                        size="small"
                        sx={{
                            p: 0,
                        }}>
                        <img // eslint-disable-line
                            alt={alt}
                            src={fileCreatedUrl}
                            style={{
                                borderRadius: '4px',
                                height: 'auto',
                                maxHeight: '200px',
                                width: '100%',
                            }}
                        />
                    </Button>
                ) : (
                    <Skeleton height={90} variant="rounded" width={160} />
                )}
            </Box>

            <Dialog onClose={handleClose} open={open}>
                <CloseIconButton onClick={handleClose} />

                {fileCreatedUrl && (
                    <img // eslint-disable-line
                        alt={alt}
                        src={fileCreatedUrl}
                        style={{ height: 'auto', width: '100%' }}
                    />
                )}
            </Dialog>
        </>
    )
}

function CloseIconButton({ onClick }: { onClick: () => void }) {
    return (
        <IconButton
            color="error"
            onClick={onClick}
            size="small"
            sx={{
                position: 'absolute',
                right: '0',
                top: '0',
            }}>
            <CloseIcon />
        </IconButton>
    )
}
