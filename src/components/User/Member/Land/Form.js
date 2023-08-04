import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, InputAdornment, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import Autocomplete from '@/components/Inputs/Autocomplete'
import DatePicker from '@/components/DatePicker'
import NumericMasking from '@/components/Inputs/NumericMasking'

export default function MemberLandForm({
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

            const plantedAt = formData.get('planted_at')

            if (plantedAt) {
                formData.set(
                    'planted_at',
                    plantedAt.split('/').reverse().join('-'),
                )
            }

            await axios.post(`/users/${userUuid}/member/lands`, formData)
            await mutate(`/users/${userUuid}`)

            if (onSubmitted) {
                onSubmitted()
            }

            if (onClose) {
                onClose()
            }

            e.target.closest('form').reset()
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                throw err
            }
        }

        setIsLoading(false)
    }

    const clearError = e => {
        const { name } = e.target

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: undefined,
            })
        }
    }

    return (
        <>
            <LoadingCenter isShow={isLoading} />
            <form
                style={{
                    marginTop: '1rem',
                    display: !isShow || isLoading ? 'none' : undefined,
                }}
                autoComplete="off"
                {...props}>
                <input type="hidden" name="region_id" />

                <Autocomplete
                    margin="normal"
                    onChange={(e, value) => {
                        document.querySelector(
                            'input[name="region_id"]',
                        ).value = value?.id
                    }}
                    endpoint="/select2/administrative-regions"
                    label="Wilayah Administratif"
                />

                <TextField
                    fullWidth
                    multiline
                    margin="normal"
                    name="detail"
                    label="Alamat Lengkap"
                    error={Boolean(errors.detail)}
                    onChange={clearError}
                    helperText={errors.detail}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    name="zip_code"
                    label="Kode Pos"
                    InputProps={{
                        inputComponent: NumericMasking,
                    }}
                    inputProps={{
                        thousandSeparator: false,
                        decimalScale: 0,
                        maxLength: 5,
                    }}
                    error={Boolean(errors.zip_code)}
                    onChange={clearError}
                    helperText={errors.zip_code}
                />

                <TextField
                    fullWidth
                    label="LAND ID (REA)"
                    margin="normal"
                    name="rea_land_id"
                    onChange={clearError}
                    error={Boolean(errors.rea_land_id)}
                    helperText={errors.rea_land_id}
                />

                <input
                    type="hidden"
                    name="n_area_hectares"
                    id="n_area_hectares"
                />

                <TextField
                    fullWidth
                    required
                    label="Luas Lahan"
                    margin="normal"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="start">Ha</InputAdornment>
                        ),
                        inputComponent: NumericMasking,
                    }}
                    onChange={e => {
                        const { value } = e.target
                        document.getElementById('n_area_hectares').value = value

                        clearError(e)
                    }}
                    error={Boolean(errors.n_area_hectares)}
                    helperText={errors.n_area_hectares}
                />

                <DatePicker
                    fullWidth
                    margin="normal"
                    label="Tanggal Tanam"
                    name="planted_at"
                    onChange={clearError}
                    error={Boolean(errors.planted_at)}
                    helperText={errors.planted_at}
                />

                <TextField
                    fullWidth
                    multiline
                    label="Catatan tambahan"
                    margin="normal"
                    name="note"
                    onChange={clearError}
                    error={Boolean(errors.note)}
                    helperText={errors.note}
                />

                <Box textAlign="right" mt={1}>
                    <Button
                        type="reset"
                        onClick={() => {
                            if (onClose) onClose()
                        }}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} variant="contained">
                        Simpan
                    </Button>
                </Box>
            </form>
        </>
    )
}
