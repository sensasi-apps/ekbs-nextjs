import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import UserSelect from '../../Select'

export default function CourierDriverForm({
    isShow,
    onClose,
    onSubmitted,
    courierUserUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target.closest('form'))

            await axios.post(
                `/users/${courierUserUuid}/courier/drivers`,
                formData,
            )
            await mutate(`/users/${courierUserUuid}`)

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
        <>
            <LoadingCenter isShow={isLoading} />
            <form
                style={{
                    marginTop: '1rem',
                    display: !isShow || isLoading ? 'none' : undefined,
                }}
                autoComplete="off"
                {...props}>
                <input type="hidden" required name="driver_user_uuid" />

                <UserSelect
                    onChange={(e, user) => {
                        setErrors({
                            ...errors,
                            driver_user_uuid: null,
                        })

                        document.querySelector(
                            'input[name="driver_user_uuid"]',
                        ).value = user?.uuid
                    }}
                    error={Boolean(errors.driver_user_uuid)}
                    helperText={errors.driver_user_uuid}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    name="license_number"
                    label="Nomor SIM"
                    error={Boolean(errors.license_number)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            license_number: null,
                        })
                    }
                    helperText={errors.license_number}
                />
                <Box textAlign="right" mt={1}>
                    <Button
                        type="reset"
                        onClick={() => {
                            if (onClose) onClose()
                        }}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </Box>
            </form>
        </>
    )
}
