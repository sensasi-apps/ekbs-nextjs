'use client'

import SendIcon from '@mui/icons-material/Send'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import myAxios from '@/lib/axios'

export default function ReplyForm({
    ticketId,
    onMessageSent,
}: {
    ticketId: number
    onMessageSent: () => void
}) {
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string>()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        setIsSubmitting(true)
        setError(undefined)

        try {
            await myAxios.post(`/issues/tickets/${ticketId}/messages`, {
                message: message.trim(),
            })

            setMessage('')
            onMessageSent()
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } }
            setError(
                error.response?.data?.message ||
                    'Gagal mengirim pesan. Silakan coba lagi.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <Box alignItems="flex-end" display="flex" gap={1}>
                <TextField
                    disabled={isSubmitting}
                    error={Boolean(error)}
                    fullWidth
                    helperText={error}
                    multiline
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tulis balasan..."
                    rows={2}
                    size="small"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                        },
                    }}
                    value={message}
                />
                <IconButton
                    color="primary"
                    disabled={isSubmitting || !message.trim()}
                    sx={{
                        '&:hover': {
                            bgcolor: 'primary.dark',
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'action.disabledBackground',
                        },
                        alignSelf: 'center',
                        bgcolor: 'primary.main',
                        color: 'white',
                    }}
                    type="submit">
                    <SendIcon />
                </IconButton>
            </Box>
        </form>
    )
}
