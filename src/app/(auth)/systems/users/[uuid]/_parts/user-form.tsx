// types

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Switch from '@mui/material/Switch'
import type { UUID } from 'crypto'
import { useRouter } from 'next/navigation'
// vendors
import { type ChangeEvent, type MouseEventHandler, useState } from 'react'
import { mutate } from 'swr'
// components
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/text-field'
import axios from '@/lib/axios'
import type User from '@/modules/user/types/orms/user'
// etcs
import useFormData from '@/providers/FormData'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

const UserForm = () => {
    const { data, handleClose } = useFormData()

    // TODO: remove casting
    const user = data as User

    const { push } = useRouter()

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
                            push(`/systems/users/${res.data}`)
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
                    decimalScale={0}
                    disabled={isLoading}
                    label="Nomor Induk Kependudukan"
                    maxLength={16}
                    minLength={16}
                    name="citizen_id"
                    onChange={clearValidationErrors}
                    thousandSeparator={false}
                    {...errorsToHelperTextObj(validationErrors?.citizen_id)}
                />
            )}

            <TextField
                defaultValue={name || ''}
                disabled={isLoading}
                fullWidth
                label="Nama Lengkap"
                margin="dense"
                name="name"
                onChange={clearValidationErrors}
                {...errorsToHelperTextObj(validationErrors?.name)}
            />

            <TextField
                defaultValue={nickname || ''}
                disabled={isLoading}
                fullWidth
                label="Nama Panggilan"
                margin="dense"
                name="nickname"
                onChange={clearValidationErrors}
                required={false}
                {...errorsToHelperTextObj(validationErrors?.nickname)}
            />

            <TextField
                defaultValue={email || ''}
                disabled={isLoading}
                label="Email"
                name="email"
                onChange={e => {
                    const value = e.target.value

                    setEmail(value)
                    clearValidationErrors(e)
                }}
                required={false}
                type="email"
                {...errorsToHelperTextObj(validationErrors?.email)}
            />

            <FormControl
                disabled={!email || isLoading}
                error={Boolean(validationErrors?.is_active)}
                fullWidth
                margin="dense">
                <FormLabel>Status Akun</FormLabel>
                <FormControlLabel
                    control={
                        <Switch
                            checked={isActive && Boolean(email)}
                            color="success"
                            name="is_active"
                            value="1"
                        />
                    }
                    label={isActive ? 'Aktif' : 'Nonaktif'}
                    onChange={ev => {
                        if ('checked' in ev.target) {
                            setIsActive(Boolean(ev.target.checked))

                            // TODO: remove casting
                            clearValidationErrors(ev as ChangeEvent)
                        }
                    }}
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
                    onClick={handleClose as MouseEventHandler}
                    size="small"
                    // TODO: remove casting
                    variant="text">
                    Batal
                </Button>

                <Button loading={isLoading} type="submit" variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}

export default UserForm
