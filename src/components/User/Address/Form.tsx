// vendors

// materials
import Box from '@mui/material/Box'
import Button, { type ButtonProps } from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import { mutate } from 'swr'
import Autocomplete from '@/components/Inputs/Autocomplete'
import NumericFormat from '@/components/numeric-format'
// components
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

export default function AddressForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
    ...props
}: {
    isShow: boolean
    onClose?: () => void
    onSubmitted?: () => void
    userUuid: string
}) {
    const [isLoading, setIsLoading] = useState(false)
    const { validationErrors: errors, setValidationErrors: setErrors } =
        useValidationErrors()

    const handleSubmit: ButtonProps['onClick'] = async event => {
        event.preventDefault()
        setIsLoading(true)

        const formEl = event.currentTarget.closest('form') as HTMLFormElement

        if (!formEl.checkValidity()) {
            return formEl.reportValidity()
        }

        const formData = new FormData(formEl)

        return axios
            .post(`/users/${userUuid}/addresses`, formData)
            .then(async () => {
                await mutate(`users/${userUuid}`)

                if (onSubmitted) {
                    onSubmitted()
                }

                if (onClose) {
                    onClose()
                }
            })
            .catch(err => {
                setIsLoading(false)

                if (err.response?.status === 422) {
                    setErrors(err.response.data.errors)
                } else {
                    throw err
                }
            })
    }

    if (!isShow) return null
    if (isLoading) return <LoadingCenter />

    return (
        <form
            autoComplete="off"
            style={{
                marginTop: '1rem',
            }}
            {...props}
            onKeyDown={e => e.key != 'Enter'}>
            <TextField
                error={Boolean(errors.label)}
                fullWidth
                helperText={
                    errors.label || 'Alamat domisili, KTP, atau lainnya'
                }
                label="Label"
                margin="normal"
                name="label"
                required
                variant="standard"
            />

            <input name="region_id" type="hidden" />

            <Autocomplete
                endpoint={`/select2/administrative-regions`}
                label="Wilayah Administratif"
                margin="normal"
                onChange={(_, value) => {
                    const inputEl = document.querySelector(
                        'input[name="region_id"]',
                    ) as HTMLInputElement
                    if (inputEl && value?.id) inputEl.value = value.id
                }}
                required
            />

            <TextField
                error={Boolean(errors.detail)}
                fullWidth
                helperText={errors.detail}
                label="Alamat Lengkap"
                margin="normal"
                multiline
                name="detail"
            />

            <NumericFormat
                decimalScale={0}
                label="Kode Pos"
                margin="normal"
                maxLength={5}
                name="zip_code"
                thousandSeparator={false}
                {...errorsToHelperTextObj(errors.zip_code)}
            />

            <Box mt={1} textAlign="right">
                <Button
                    color="info"
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>

                <Button color="info" onClick={handleSubmit} variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
