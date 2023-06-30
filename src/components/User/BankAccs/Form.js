import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function UserBankAccForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target)

            await axios.post(`/users/${userUuid}/bank-accs`, formData)
            await mutate(`/users/${userUuid}`)

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

    if (!isShow) return null
    if (isLoading) return <LoadingCenter />

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
                label="Nama Bank"
                margin="normal"
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
                required
                label="Nomor Rekening"
                name="no"
                margin="normal"
                onChange={() =>
                    setErrors({
                        ...errors,
                        no: null,
                    })
                }
                error={Boolean(errors.no)}
                helperText={errors.no}
            />

            <Box textAlign="right" mt={1}>
                <Button
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>
                <Button type="submit">Simpan</Button>
            </Box>
        </form>
    )
}
