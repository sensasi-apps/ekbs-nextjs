// vendors
import { type FormEvent, useState } from 'react'
import { type UUIDTypes } from 'uuid'
import { mutate } from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
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
            style={{
                marginTop: '1rem',
            }}
            onSubmit={handleSubmit}
            autoComplete="off">
            <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Nama Bank"
                margin="dense"
                name="name"
                onChange={() =>
                    setErrors(prev => {
                        delete prev?.name
                        return prev
                    })
                }
                error={Boolean(errors?.name)}
                helperText={errors?.name}
            />

            <TextField
                fullWidth
                disabled={isLoading}
                required
                label="Nomor Rekening"
                name="no"
                margin="dense"
                onChange={() =>
                    setErrors(prev => {
                        delete prev?.no
                        return prev
                    })
                }
                error={Boolean(errors?.no)}
                helperText={errors?.no}
            />

            <Box textAlign="right" mt={2}>
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
