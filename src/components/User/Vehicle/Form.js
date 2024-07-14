// vendors
import { useState, forwardRef } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'
// components
import NumericFormat from '@/components/NumericFormat'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

const UserVehicleForm = ({ onClose, courierUserUuid, ...props }, ref) => {
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
        <form autoComplete="off" onSubmit={handleSubmit} ref={ref} {...props}>
            <TextField
                fullWidth
                required
                disabled={isLoading}
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
                disabled={isLoading}
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

            <NumericFormat
                disabled={isLoading}
                margin="normal"
                label="Kapasitas Muatan"
                value={inputMaxCapacityValue}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ton</InputAdornment>
                    ),
                }}
                onChange={e => {
                    const { value } = e.target
                    document.getElementById('max_capacity_ton').value = value
                    setInputMaxCapacityValue(value)

                    return clearError(e)
                }}
                {...errorsToHelperTextObj(errors.max_capacity_ton)}
            />

            <TextField
                fullWidth
                required
                disabled={isLoading}
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
                    disabled={isLoading}
                    onClick={() => {
                        setInputMaxCapacityValue('')

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

export default forwardRef(UserVehicleForm)
