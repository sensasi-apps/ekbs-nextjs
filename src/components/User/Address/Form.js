import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import Autocomplete from '@/components/Inputs/Autocomplete'

export default function AddressForm({
    isShow,
    onClose,
    onSubmitted,
    userUuid,
    ...props
}) {
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(e.target.closest('form'))

            await axios.post(`/users/${userUuid}/addresses`, formData)
            await mutate(`/users/${userUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

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

    if (!isShow) return null
    if (isLoading) return <LoadingCenter />

    return (
        <form
            style={{
                marginTop: '1rem',
            }}
            onSubmit={handleSubmit}
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
                    document.querySelector('input[name="region_id"]').value =
                        value?.id
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

            <TextField
                fullWidth
                margin="normal"
                name="zip_code"
                label="Kode Pos"
                type="number"
                error={Boolean(errors.zip_code)}
                helperText={errors.zip_code}
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
