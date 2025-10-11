// types

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import type { AxiosError } from 'axios'
// vendors
import { useState } from 'react'
import { mutate } from 'swr'
// components
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/user-autocomplete'
import axios from '@/lib/axios'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function UserDriverForm({
    onClose,
    courierUserUuid,
}: {
    onClose?: () => void
    courierUserUuid: string
}) {
    const [formValues, setFormValues] = useState<{
        driver_user_uuid?: string
        license_number?: string
    }>()
    const [errors, setErrors] = useState<Record<string, string[] | undefined>>()
    const [isLoading, setIsLoading] = useState(false)

    return (
        <form
            autoComplete="off"
            onSubmit={e => {
                e.preventDefault()
                setIsLoading(true)

                const form = e.currentTarget
                if (!form.reportValidity()) {
                    setIsLoading(false)
                    return false
                }

                return axios
                    .post(
                        `/users/${courierUserUuid}/courier/drivers`,
                        formValues,
                    )
                    .then(() => {
                        mutate(`users/${courierUserUuid}`).then(() => {
                            onClose?.()
                        })
                    })
                    .catch((err: AxiosError<LaravelValidationException>) => {
                        if (err.response?.status === 422) {
                            setErrors(err.response.data.errors)
                        } else {
                            throw err
                        }
                    })
                    .finally(() => {
                        setIsLoading(false)
                    })
            }}>
            <UserAutocomplete
                disabled={isLoading}
                label="Nama"
                onChange={(_, user) => {
                    if (!user || !user?.uuid) return

                    setErrors({
                        ...errors,
                        driver_user_uuid: undefined,
                    })

                    setFormValues({
                        ...formValues,
                        driver_user_uuid: user.uuid,
                    })
                }}
                {...errorsToHelperTextObj(errors?.driver_user_uuid)}
            />

            <TextField
                disabled={isLoading}
                label="Nomor SIM"
                name="license_number"
                onChange={ev => {
                    setErrors({
                        ...errors,
                        license_number: undefined,
                    })

                    setFormValues({
                        ...formValues,
                        license_number: ev.target.value,
                    })
                }}
                {...errorsToHelperTextObj(errors?.license_number)}
            />

            <Box mt={1} textAlign="right">
                <Button
                    color="info"
                    disabled={isLoading}
                    onClick={() => {
                        if (onClose) onClose()
                    }}
                    type="reset">
                    Batal
                </Button>

                <Button
                    color="info"
                    loading={isLoading}
                    type="submit"
                    variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
