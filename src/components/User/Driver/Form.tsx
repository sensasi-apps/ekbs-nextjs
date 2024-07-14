import { useState, forwardRef } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import LoadingButton from '@mui/lab/LoadingButton'

import UserSelect from '../Select'

const UserDriverForm = ({ onClose, courierUserUuid, ...props }, ref) => {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        const form = e.target.closest('form')
        if (!form.reportValidity()) {
            setIsLoading(false)
            return false
        }

        const formData = new FormData(form)

        try {
            await axios.post(
                `/users/${courierUserUuid}/courier/drivers`,
                formData,
            )
            await mutate(`/users/${courierUserUuid}`)

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
        <form ref={ref} autoComplete="off" {...props}>
            <input type="hidden" required name="driver_user_uuid" />

            <UserSelect
                required
                disabled={isLoading}
                margin="dense"
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
                disabled={isLoading}
                margin="dense"
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
                    disabled={isLoading}
                    color="info"
                    type="reset"
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>
                <LoadingButton
                    onClick={handleSubmit}
                    loading={isLoading}
                    variant="contained"
                    color="info">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}

export default forwardRef(UserDriverForm)
