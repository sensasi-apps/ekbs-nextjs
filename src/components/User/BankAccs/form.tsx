// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { type FormEvent, useState } from 'react'
import { mutate } from 'swr'
import { type UUIDTypes } from 'uuid'
//
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'

export default function UserBankAccForm({
    isShow,
    onClose,
    userUuid,
}: {
    isShow: boolean
    onClose: () => void
    userUuid: UUIDTypes
}) {
    const [errors, setErrors] = useState<LaravelValidationException['errors']>()
    const [isLoading, setIsLoading] = useState(false)

    if (!isShow) return null

    const handleSubmit = (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault()
        setIsLoading(true)

        const formData = new FormData(ev.currentTarget)

        axios
            .post(`/users/${userUuid}/bank-accs`, formData)
            .then(() => {
                mutate(`users/${userUuid}`)
                onClose()
            })
            .catch(err => {
                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors)
                } else {
                    throw err
                }
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <form
            autoComplete="off"
            onSubmit={handleSubmit}
            style={{
                marginTop: '1rem',
            }}>
            <TextField
                disabled={isLoading}
                error={Boolean(errors?.name)}
                fullWidth
                helperText={errors?.name}
                label="Nama Bank"
                margin="dense"
                name="name"
                onChange={() =>
                    setErrors(prev => {
                        delete prev?.name
                        return prev
                    })
                }
                required
            />

            <TextField
                disabled={isLoading}
                error={Boolean(errors?.no)}
                fullWidth
                helperText={errors?.no}
                label="Nomor Rekening"
                margin="dense"
                name="no"
                onChange={() =>
                    setErrors(prev => {
                        delete prev?.no
                        return prev
                    })
                }
                required
            />

            <Box mt={2} textAlign="right">
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>
                <Button loading={isLoading} type="submit" variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
