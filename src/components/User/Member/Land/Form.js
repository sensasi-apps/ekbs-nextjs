import { useState } from 'react'
import { mutate } from 'swr'

import axios from '@/lib/axios'

import { Box, Button, TextField } from '@mui/material'

import LoadingCenter from '@/components/Statuses/LoadingCenter'
import Autocomplete from '@/components/Inputs/Autocomplete'
import DatePicker from '@/components/DatePicker'

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
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors)
            } else {
                throw err
            }
        }

        setIsLoading(false)
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
                    onChange={() =>
                        setErrors({
                            ...errors,
                            detail: null,
                        })
                    }
                    helperText={errors.detail}
                />

                <TextField
                    fullWidth
                    margin="normal"
                    name="zip_code"
                    label="Kode Pos"
                    type="number"
                    error={Boolean(errors.zip_code)}
                    onChange={() =>
                        setErrors({
                            ...errors,
                            zip_code: null,
                        })
                    }
                    helperText={errors.zip_code}
                />

                <TextField
                    fullWidth
                    label="LAND ID (REA)"
                    margin="normal"
                    name="rea_land_id"
                    onChange={() =>
                        setErrors({
                            ...errors,
                            rea_land_id: null,
                        })
                    }
                    error={Boolean(errors.rea_land_id)}
                    helperText={errors.rea_land_id}
                />

                <TextField
                    fullWidth
                    required
                    type="number"
                    inputMode="numeric"
                    inputProps={{
                        step: 0.01,
                    }}
                    label="Luas Lahan (Ha)"
                    margin="normal"
                    name="n_area_hectares"
                    onChange={() =>
                        setErrors({
                            ...errors,
                            n_area_hectares: null,
                        })
                    }
                    error={Boolean(errors.n_area_hectares)}
                    helperText={errors.n_area_hectares}
                />

                <DatePicker
                    fullWidth
                    margin="normal"
                    label="Tanggal Tanam"
                    name="planted_at"
                    onChange={() =>
                        setErrors({
                            ...errors,
                            planted_at: null,
                        })
                    }
                    error={Boolean(errors.planted_at)}
                    helperText={errors.planted_at}
                />

                <TextField
                    fullWidth
                    multiline
                    label="Catatan tambahan"
                    margin="normal"
                    name="note"
                    onChange={() =>
                        setErrors({
                            ...errors,
                            note: null,
                        })
                    }
                    error={Boolean(errors.note)}
                    helperText={errors.note}
                />

                <Box textAlign="right" mt={1}>
                    <Button
                        onClick={() => {
                            if (onClose) onClose()
                        }}>
                        Batal
                    </Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </Box>
            </form>
        </>
    )
}
