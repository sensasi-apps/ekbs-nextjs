import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function CourierVehicleForm({
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
            const formEl = e.target
            const formData = new FormData(formEl)

            await axios.post(
                `/users/couriers/${courierUserUuid}/vehicles`,
                formData,
            )
            await mutate(`/users/${courierUserUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

            formEl.reset()

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
                onSubmit={handleSubmit}
                {...props}>
                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Merk"
                    name="brand"
                    error={Boolean(errors.brand)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            brand: null,
                        })
                    }
                    helperText={errors.brand}
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Model / Tipe"
                    name="type"
                    error={Boolean(errors.type)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            type: null,
                        })
                    }
                    helperText={errors.type}
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Kapasitas Muatan (Ton)"
                    name="max_capacity_ton"
                    type="number"
                    inputProps={{
                        step: 0.01,
                    }}
                    error={Boolean(errors.max_capacity_ton)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            max_capacity_ton: null,
                        })
                    }
                    helperText={errors.max_capacity_ton}
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Nomor Plat Kendaraan"
                    name="plate_number"
                    error={Boolean(errors.plate_number)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            plate_number: null,
                        })
                    }
                    helperText={errors.plate_number}
                />
                <Box textAlign="right" mt={1}>
                    <Button
                        type="reset"
                        onClick={() => {
                            if (onClose) onClose()
                        }}>
                        Batal
                    </Button>
                    <Button type="submit">Simpan</Button>
                </Box>
            </form>
        </>
    )
}
