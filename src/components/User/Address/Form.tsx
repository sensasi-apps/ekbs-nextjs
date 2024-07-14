// vendors
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// components
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import Autocomplete from '@/components/Inputs/Autocomplete'
import useValidationErrors from '@/hooks/useValidationErrors'
import NumericFormat from '@/components/NumericFormat'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'

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
                await mutate(`/users/${userUuid}`)

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
            style={{
                marginTop: '1rem',
            }}
            autoComplete="off"
            {...props}
            onKeyDown={e => e.key != 'Enter'}>
            <TextField
                fullWidth
                required
                variant="standard"
                label="Label"
                name="label"
                margin="normal"
                error={Boolean(errors.label)}
                helperText={
                    errors.label || 'Alamat domisili, KTP, atau lainnya'
                }
            />

            <input type="hidden" name="region_id" />

            <Autocomplete
                margin="normal"
                required
                onChange={(e, value) => {
                    const inputEl = document.querySelector(
                        'input[name="region_id"]',
                    ) as HTMLInputElement
                    if (inputEl && value?.id) inputEl.value = value.id
                }}
                endpoint={`/select2/administrative-regions`}
                label="Wilayah Administratif"
            />

            <TextField
                fullWidth
                multiline
                margin="normal"
                name="detail"
                label="Alamat Lengkap"
                error={Boolean(errors.detail)}
                helperText={errors.detail}
            />

            <NumericFormat
                margin="normal"
                name="zip_code"
                label="Kode Pos"
                decimalScale={0}
                maxLength={5}
                thousandSeparator={false}
                {...errorsToHelperTextObj(errors.zip_code)}
            />

            <Box textAlign="right" mt={1}>
                <Button
                    color="info"
                    onClick={() => {
                        if (onClose) onClose()
                    }}>
                    Batal
                </Button>

                <Button color="info" variant="contained" onClick={handleSubmit}>
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
