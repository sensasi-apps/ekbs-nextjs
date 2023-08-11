import { useState } from 'react'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'

import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Switch,
    TextField,
} from '@mui/material'

import { LoadingButton } from '@mui/lab'
import NumericMasking from '../Inputs/NumericMasking'
import useFormData from '@/providers/FormData'

const UserForm = () => {
    const { data: user, handleClose } = useFormData()

    const router = useRouter()

    // UI states
    const [validationErrors, setValidationErrors] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // data states
    const [email, setEmail] = useState(user?.email)
    const [isActive, setIsActive] = useState(user?.is_active)

    const { uuid, name } = user || {}

    const handleSubmit = async event => {
        event.preventDefault()

        setIsLoading(true)

        try {
            const formData = new FormData(event.target.closest('form'))
            formData.set('is_active', isActive && email ? 1 : 0)

            if (uuid) {
                formData.set('_method', 'PUT')
                await axios.post(`/users/${uuid}`, formData)
                await mutate(`/users/${uuid}`)
            } else {
                const { data: newUserUuid } = await axios.post(
                    '/users',
                    formData,
                )
                router.push(`/users/${newUserUuid}`)
            }

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    const clearValidationErrors = e => {
        const { name } = e.target
        if (validationErrors[name]) {
            setValidationErrors({
                ...validationErrors,
                [name]: undefined,
            })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            {!uuid && (
                <TextField
                    fullWidth
                    required
                    name="citizen_id"
                    label="Nomor Induk Kependudukan"
                    disabled={isLoading}
                    margin="dense"
                    error={Boolean(validationErrors.citizen_id)}
                    helperText={validationErrors.citizen_id}
                    onChange={clearValidationErrors}
                    minLength={16}
                    maxLength={16}
                    inputMode="numeric"
                    InputProps={{
                        inputComponent: NumericMasking,
                    }}
                    inputProps={{
                        decimalScale: 0,
                        thousandSeparator: '',
                        minLength: 16,
                        maxLength: 16,
                    }}
                />
            )}

            <TextField
                name="name"
                label="Nama"
                disabled={isLoading}
                defaultValue={name || ''}
                fullWidth
                required
                margin="dense"
                error={Boolean(validationErrors.name)}
                helperText={validationErrors.name}
                onChange={clearValidationErrors}
            />

            <TextField
                name="email"
                label="Email"
                type="email"
                disabled={isLoading}
                defaultValue={email || ''}
                fullWidth
                margin="dense"
                error={Boolean(validationErrors.email)}
                helperText={validationErrors.email}
                onChange={e => {
                    const value = e.target.value

                    setEmail(value)
                    clearValidationErrors(e)
                }}
            />

            <FormControl
                fullWidth
                disabled={!email || isLoading}
                margin="dense"
                error={Boolean(validationErrors.is_active)}>
                <FormLabel>Status Akun</FormLabel>
                <FormControlLabel
                    onChange={e => {
                        setIsActive(e.target.checked)
                        clearValidationErrors(e)
                    }}
                    label={isActive ? 'Aktif' : 'Nonaktif'}
                    control={
                        <Switch
                            color="success"
                            name="is_active"
                            value="1"
                            checked={isActive && Boolean(email)}
                        />
                    }
                />
                {validationErrors.is_active && (
                    <FormHelperText>
                        {validationErrors.is_active}
                    </FormHelperText>
                )}
            </FormControl>

            <Box display="flex" justifyContent="end">
                <Button
                    disabled={isLoading}
                    size="small"
                    variant="text"
                    onClick={handleClose}>
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

export default UserForm
