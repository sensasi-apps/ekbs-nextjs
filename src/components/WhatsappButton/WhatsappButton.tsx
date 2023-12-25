// types
import type { TooltipProps } from '@mui/material/Tooltip'
import type { IconButtonProps } from '@mui/material/IconButton'
// vendort
import { memo, useState } from 'react'
import axios from '@/lib/axios'
import { closeSnackbar, enqueueSnackbar } from 'notistack'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import WhatsAppIcon from '@mui/icons-material/WhatsApp'

const COOLDOWN_MS = 60000

const WhatsAppButton = memo(function WhatsAppButton({
    endpoint,
    title,
}: {
    endpoint: string
    title: string
    slotProps?: {
        tooltip?: TooltipProps
        iconButton?: IconButtonProps
    }
}) {
    const [disabled, setDisabled] = useState(false)

    return (
        <Tooltip
            title={
                disabled ? `Mohon tunggu ${COOLDOWN_MS / 60000} menit` : title
            }
            placement="top">
            <span>
                <IconButton
                    size="small"
                    disabled={disabled}
                    color="success"
                    onClick={() => {
                        const key = enqueueSnackbar('Mengirim notifikasi...', {
                            variant: 'info',
                        })

                        axios
                            .post(endpoint)
                            .then(({ data: { message } }) => {
                                setDisabled(true)

                                enqueueSnackbar(
                                    message ?? 'Permintaan berhasil dikirim',
                                    {
                                        variant: 'success',
                                    },
                                )

                                setTimeout(() => {
                                    setDisabled(false)
                                }, COOLDOWN_MS)
                            })
                            .catch(({ response: { data }, message }) =>
                                enqueueSnackbar(
                                    data?.message ??
                                        message ??
                                        'Gagal mengirimkan permintaan',
                                    {
                                        variant: 'error',
                                        persist: true,
                                    },
                                ),
                            )
                            .finally(() => closeSnackbar(key))
                    }}>
                    <WhatsAppIcon />
                </IconButton>
            </span>
        </Tooltip>
    )
})

export default WhatsAppButton
