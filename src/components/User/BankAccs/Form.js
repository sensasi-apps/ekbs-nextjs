import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import { LoadingButton } from '@mui/lab'

export default function UserBankAccForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    if (!isShow) return null

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target)

            await axios.post(`/users/${userUuid}/bank-accs`, formData)
            await mutate(`users/${userUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

            if (onClose) {
                onClose()
            }
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                throw err
            }
        }

        setIsLoading(false)
    }

    return (
        <form
            style={{
                marginTop: '1rem',
            }}
            onSubmit={handleSubmit}
            autoComplete="off"
            {...props}>
            <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Nama Bank"
                margin="dense"
                name="name"
                onChange={() =>
                    setErrors({
                        ...errors,
                        name: null,
                    })
                }
                error={Boolean(errors.name)}
                helperText={errors.name}
            />

            <TextField
                fullWidth
                disabled={isLoading}
                required
                label="Nomor Rekening"
                name="no"
                margin="dense"
                onChange={() =>
                    setErrors({
                        ...errors,
                        no: null,
                    })
                }
                error={Boolean(errors.no)}
                helperText={errors.no}
            />

            <Box textAlign="right" mt={2}>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>
                <LoadingButton
                    loading={isLoading}
                    type="submit"
                    variant="contained">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}
