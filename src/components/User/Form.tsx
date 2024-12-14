// types
import type { UUID } from 'crypto'
import type User from '@/dataTypes/User'
// vendors
import { ChangeEvent, MouseEventHandler, useState } from 'react'
import { mutate } from 'swr'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import LoadingButton from '@mui/lab/LoadingButton'
// components
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
// etcs
import useFormData from '@/providers/FormData'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

const UserForm = () => {
    const { data, handleClose } = useFormData()

    // TODO: remove casting
    const user = data as User

    const router = useRouter()

    // UI states
    const [validationErrors, setValidationErrors] =
        useState<Record<string, string[] | undefined>>()
    const [isLoading, setIsLoading] = useState(false)

    // data states
    const [email, setEmail] = useState(user?.email)
    const [isActive, setIsActive] = useState(user?.is_active)

    const { uuid, name, nickname } = user || {}

    const clearValidationErrors = ({ target }: ChangeEvent) => {
        if (
            'name' in target &&
            validationErrors &&
            validationErrors[target.name as string]
        ) {
            setValidationErrors({
                ...validationErrors,
                [target.name as string]: undefined,
            })
        }
    }

    return (
        <form
            onSubmit={event => {
                event.preventDefault()

                setIsLoading(true)

                const formData = new FormData(event.currentTarget)
                formData.set(
                    'is_active',
                    (isActive && email ? 1 : 0).toString(),
                )

                if (uuid) {
                    formData.set('_method', 'PUT')
                }

                return axios
                    .post<UUID>('/users' + (uuid ? `/${uuid}` : ''), formData)
                    .then(res => {
                        if (uuid) {
                            mutate(`users/${uuid}`)
                        } else {
                            router.push('/users/' + res.data)
                        }
                        handleClose()
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 422) {
                            setValidationErrors(error.response.data.errors)
                        } else {
                            throw error
                        }
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }}>
            {!uuid && (
                <NumericFormat
                    name="citizen_id"
                    label="Nomor Induk Kependudukan"
                    disabled={isLoading}
                    onChange={clearValidationErrors}
                    minLength={16}
                    maxLength={16}
                    thousandSeparator={false}
                    decimalScale={0}
                    {...errorsToHelperTextObj(validationErrors?.citizen_id)}
                />
            )}

            <TextField
                name="name"
                label="Nama Lengkap"
                disabled={isLoading}
                defaultValue={name || ''}
                fullWidth
                margin="dense"
                onChange={clearValidationErrors}
                {...errorsToHelperTextObj(validationErrors?.name)}
            />

            <TextField
                name="nickname"
                label="Nama Panggilan"
                disabled={isLoading}
                defaultValue={nickname || ''}
                required={false}
                fullWidth
                margin="dense"
                onChange={clearValidationErrors}
                {...errorsToHelperTextObj(validationErrors?.nickname)}
            />

            <TextField
                name="email"
                label="Email"
                type="email"
                required={false}
                disabled={isLoading}
                defaultValue={email || ''}
                onChange={e => {
                    const value = e.target.value

                    setEmail(value)
                    clearValidationErrors(e)
                }}
                {...errorsToHelperTextObj(validationErrors?.email)}
            />

            <FormControl
                fullWidth
                disabled={!email || isLoading}
                margin="dense"
                error={Boolean(validationErrors?.is_active)}>
                <FormLabel>Status Akun</FormLabel>
                <FormControlLabel
                    onChange={ev => {
                        if ('checked' in ev.target) {
                            setIsActive(Boolean(ev.target.checked))

                            // TODO: remove casting
                            clearValidationErrors(ev as ChangeEvent)
                        }
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
                {validationErrors?.is_active && (
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
                    // TODO: remove casting
                    onClick={handleClose as MouseEventHandler}>
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
