// types
import type { AxiosError } from 'axios'
import type { UUID } from 'crypto'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vendors
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import LoadingButton from '@mui/lab/LoadingButton'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
// components
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/UserAutocomplete'

export default function UserDriverForm({
    onClose,
    courierUserUuid,
}: {
    onClose?: () => void
    courierUserUuid: UUID
}) {
    const [formValues, setFormValues] = useState<{
        driver_user_uuid?: UUID
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
                        mutate(`/users/${courierUserUuid}`).then(() => {
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
                name="license_number"
                label="Nomor SIM"
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
                    type="submit"
                    loading={isLoading}
                    variant="contained"
                    color="info">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}
