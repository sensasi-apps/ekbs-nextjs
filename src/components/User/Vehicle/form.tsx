// vendors

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { type ChangeEvent, type FormEvent, useState } from 'react'
import { mutate } from 'swr'
import type { UUIDTypes } from 'uuid'
// components
import NumericFormat from '@/components/NumericFormat'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function UserVehicleForm({
    onClose,
    courierUserUuid,
}: {
    onClose: () => void
    courierUserUuid: UUIDTypes
}) {
    const [errors, setErrors] = useState<LaravelValidationException['errors']>()
    const [isLoading, setIsLoading] = useState(false)
    const [inputMaxCapacityValue, setInputMaxCapacityValue] = useState<number>()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const formEl = e.currentTarget
        const formData = new FormData(formEl)

        axios
            .post(`/users/${courierUserUuid}/courier/vehicles`, formData)
            .then(() => {
                mutate(`users/${courierUserUuid}`)

                formEl.reset()
                setInputMaxCapacityValue(undefined)
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

    const clearError = (e: ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target

        if (errors?.[name]) {
            setErrors(() => {
                const newErrors = { ...errors }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    return (
        <form autoComplete="off" onSubmit={handleSubmit}>
            <TextField
                disabled={isLoading}
                fullWidth
                label="Merk"
                margin="normal"
                name="brand"
                onChange={clearError}
                required
                {...errorsToHelperTextObj(errors?.brand)}
            />

            <TextField
                disabled={isLoading}
                fullWidth
                label="Model / Tipe"
                margin="normal"
                name="type"
                onChange={clearError}
                required
                {...errorsToHelperTextObj(errors?.type)}
            />

            <input
                id="max_capacity_ton"
                name="max_capacity_ton"
                type="hidden"
                value={inputMaxCapacityValue ?? ''}
            />

            <NumericFormat
                disabled={isLoading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ton</InputAdornment>
                    ),
                }}
                label="Kapasitas Muatan"
                margin="normal"
                onChange={clearError}
                onValueChange={({ floatValue }) => {
                    setInputMaxCapacityValue(floatValue)
                }}
                value={inputMaxCapacityValue ?? ''}
                {...errorsToHelperTextObj(errors?.max_capacity_ton)}
            />

            <TextField
                disabled={isLoading}
                fullWidth
                label="Nomor Plat Kendaraan"
                margin="normal"
                name="plate_number"
                onChange={clearError}
                required
                {...errorsToHelperTextObj(errors?.plate_number)}
            />

            <Box mt={1} textAlign="right">
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        setInputMaxCapacityValue(undefined)
                        onClose()
                    }}
                    type="reset">
                    Batal
                </Button>
                <Button loading={isLoading} type="submit" variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
