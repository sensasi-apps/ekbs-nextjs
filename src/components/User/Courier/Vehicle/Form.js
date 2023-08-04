import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, InputAdornment, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import NumericMasking from '@/components/Inputs/NumericMasking'

export default function CourierVehicleForm({
    isShow,
    onClose,
    onSubmitted,
    courierUserUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [inputMaxCapacityValue, setInputMaxCapacityValue] = useState('')

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formEl = e.target
            const formData = new FormData(formEl)

            await axios.post(
                `/users/${courierUserUuid}/courier/vehicles`,
                formData,
            )
            await mutate(`/users/${courierUserUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

            if (onClose) {
                formEl.reset()
                setInputMaxCapacityValue('')
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

    const clearError = e => {
        const { name } = e.target

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            })
        }
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
                    onChange={clearError}
                    helperText={errors.brand}
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Model / Tipe"
                    name="type"
                    error={Boolean(errors.type)}
                    onChange={clearError}
                    helperText={errors.type}
                />

                <input
                    type="hidden"
                    id="max_capacity_ton"
                    name="max_capacity_ton"
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Kapasitas Muatan"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">
                                Ton
                            </InputAdornment>
                        ),
                        inputComponent: NumericMasking,
                    }}
                    error={Boolean(errors.max_capacity_ton)}
                    onChange={e => {
                        const { value } = e.target
                        document.getElementById('max_capacity_ton').value =
                            value
                        setInputMaxCapacityValue(value)

                        return clearError(e)
                    }}
                    value={inputMaxCapacityValue}
                    helperText={errors.max_capacity_ton}
                />

                <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Nomor Plat Kendaraan"
                    name="plate_number"
                    error={Boolean(errors.plate_number)}
                    onChange={clearError}
                    helperText={errors.plate_number}
                />

                <Box textAlign="right" mt={1}>
                    <Button
                        type="reset"
                        onClick={() => {
                            setInputMaxCapacityValue('')

                            if (onClose) onClose()
                        }}>
                        Batal
                    </Button>
                    <Button type="submit" variant="contained">
                        Simpan
                    </Button>
                </Box>
            </form>
        </>
    )
}
