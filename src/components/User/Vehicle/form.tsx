// vendors
import { type UUIDTypes } from 'uuid'
import { type FormEvent, useState, type ChangeEvent } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
// components
import NumericFormat from '@/components/NumericFormat'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import type LaravelValidationException from '@/types/LaravelValidationException'

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
                fullWidth
                required
                disabled={isLoading}
                margin="normal"
                label="Merk"
                name="brand"
                onChange={clearError}
                {...errorsToHelperTextObj(errors?.brand)}
            />

            <TextField
                fullWidth
                required
                disabled={isLoading}
                margin="normal"
                label="Model / Tipe"
                name="type"
                onChange={clearError}
                {...errorsToHelperTextObj(errors?.type)}
            />

            <input
                type="hidden"
                id="max_capacity_ton"
                name="max_capacity_ton"
                value={inputMaxCapacityValue ?? ''}
            />

            <NumericFormat
                disabled={isLoading}
                margin="normal"
                label="Kapasitas Muatan"
                value={inputMaxCapacityValue ?? ''}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ton</InputAdornment>
                    ),
                }}
                onValueChange={({ floatValue }) => {
                    setInputMaxCapacityValue(floatValue)
                }}
                onChange={clearError}
                {...errorsToHelperTextObj(errors?.max_capacity_ton)}
            />

            <TextField
                fullWidth
                required
                disabled={isLoading}
                margin="normal"
                label="Nomor Plat Kendaraan"
                name="plate_number"
                onChange={clearError}
                {...errorsToHelperTextObj(errors?.plate_number)}
            />

            <Box textAlign="right" mt={1}>
                <Button
                    type="reset"
                    disabled={isLoading}
                    onClick={() => {
                        setInputMaxCapacityValue(undefined)
                        onClose()
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
