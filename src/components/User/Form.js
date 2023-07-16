import { useState } from 'react'
import { mutate } from 'swr'
import { useRouter } from 'next/router'

import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

import LoadingCenter from '../Statuses/LoadingCenter'
import ErrorCenter from '../Statuses/ErrorCenter'

export default function UserForm({ data: user = {}, onClose, ...props }) {
    const router = useRouter()
    const [errors, setErrors] = useState([])

    const [formValues, setFormValues] = useState({
        citizen_id: user?.detail?.citizen_id || '',
        name: user?.name || '',
        email: user?.email || '',
        is_active: user?.is_active || false,
    })

    const [isError, setIsError] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [statusTitle, setStatusTitle] = useState(null)

    const clearThisError = event => {
        setErrors({
            ...errors,
            [event.target.name]: null,
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        setIsLoading(true)

        try {
            if (user.uuid) {
                await axios.put(`/users/${user.uuid}`, formValues)
                await mutate(`/users/${user.uuid}`)
            } else {
                const { data } = await axios.post('/users', formValues)
                router.push(`/users/${data.uuid}`)
            }

            if (onClose) onClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors)
            } else {
                setIsError(true)
                setStatusTitle(`Terjadi kesalahan: ${error.message}`)
            }
        }

        setIsLoading(false)
    }

    if (isError)
        return (
            <ErrorCenter
                message={statusTitle}
                onClose={() => setIsError(false)}
            />
        )

    if (isLoading) return <LoadingCenter />

    return (
        <form {...props} onSubmit={handleSubmit}>
            {!user.uuid && (
                <TextField
                    name="citizen_id"
                    label="Nomor Induk Kependudukan"
                    fullWidth
                    required
                    defaultValue={formValues.citizen_id || ''}
                    margin="normal"
                    error={Boolean(errors.citizen_id)}
                    helperText={errors.citizen_id}
                    onChange={e => {
                        setFormValues({
                            ...formValues,
                            citizen_id: e.target.value,
                        })
                        clearThisError(e)
                    }}
                />
            )}

            <TextField
                name="name"
                label="Nama"
                defaultValue={formValues.name || ''}
                fullWidth
                required
                margin="normal"
                error={Boolean(errors.name)}
                helperText={errors.name}
                onChange={e => {
                    setFormValues({
                        ...formValues,
                        name: e.target.value,
                    })
                    clearThisError(e)
                }}
            />

            <TextField
                name="email"
                label="Email"
                type="email"
                defaultValue={formValues.email || ''}
                fullWidth
                margin="normal"
                error={Boolean(errors.email)}
                helperText={errors.email}
                onChange={e => {
                    setFormValues({
                        ...formValues,
                        email: e.target.value,
                    })
                    clearThisError(e)
                }}
            />

            <FormControl
                fullWidth
                disabled={!formValues.email}
                margin="normal"
                error={Boolean(errors.is_active)}>
                <FormLabel>Status Akun</FormLabel>
                <FormControlLabel
                    onChange={e => {
                        setFormValues({
                            ...formValues,
                            is_active: e.target.checked,
                        })
                        clearThisError(e)
                    }}
                    sx={{
                        color: formValues.is_active
                            ? 'success.light'
                            : 'text.secondary',
                    }}
                    label={formValues.is_active ? 'Aktif' : 'Nonaktif'}
                    control={
                        <Switch
                            color="success"
                            name="is_active"
                            value="1"
                            defaultChecked={formValues.is_active}
                        />
                    }
                />
                <FormHelperText>{errors.is_active}</FormHelperText>
            </FormControl>

            <Box display="flex" justifyContent="end">
                <Button variant="text" onClick={onClose}>
                    Batal
                </Button>
                <Button type="submit" variant="text">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
