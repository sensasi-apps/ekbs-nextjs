import { useState, FC } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import LoadingButton from '@mui/lab/LoadingButton'

import Autocomplete from '@/components/Inputs/Autocomplete'
import DatePicker from '@/components/DatePicker'
import NumericMasking from '@/components/Inputs/NumericMasking'

import Address from '@/types/Address'
import Land from '@/types/Land'
import SelectInputFromApi from '@/components/SelectInputFromApi'

const INITIAL_STATE = {
    n_area_hectares: undefined,
    rea_land_id: undefined,
    planted_at: undefined,
    region_id: undefined,
    detail: undefined,
    zip_code: undefined,
    note: undefined,
}

type Props = {
    data: Land
    userUuid: string
    onCancel: () => void
    isLoading: boolean
    onSubmit: () => void
    setIsLoading: (isLoading: boolean) => void
}

const getRegion = (address?: Address): { id: string } | null => {
    return address?.village || address?.district || address?.regency || null
}

const UserLandForm: FC<Props> = (props: Props) => {
    const { data, userUuid, onCancel, onSubmit, isLoading, setIsLoading } =
        props
    const {
        n_area_hectares,
        rea_land_id,
        planted_at,
        note,
        address,
        farmer_group_uuid,
    } = data || {}

    const [validationErrors, setValidationErrors] = useState(INITIAL_STATE)

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        const formEl = e.target.closest('form')
        if (!formEl.reportValidity()) return

        setIsLoading(true)
        const formData = new FormData(formEl)
        const dataFormData = Object.fromEntries(formData.entries())

        try {
            if (data?.uuid) {
                await axios.put(
                    `/users/${userUuid}/lands/${data.uuid}`,
                    dataFormData,
                )
            } else {
                await axios.post(`/users/${userUuid}/lands`, dataFormData)
            }
            await mutate(`/users/${userUuid}`)
        } catch (err: any) {
            if (err.response?.status === 422) {
                setValidationErrors(err.response.data.errors)
            } else {
                throw err
            }
        }

        setIsLoading(false)
        onSubmit()
    }

    const clearValidationError = (e: any) => {
        const name: string = e.target.name

        if (validationErrors[name as keyof typeof INITIAL_STATE]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined,
            }))
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="hidden"
                name="n_area_hectares"
                id="n_area_hectares"
                defaultValue={n_area_hectares}
            />

            <TextField
                fullWidth
                required
                disabled={isLoading}
                label="Luas Lahan"
                margin="dense"
                defaultValue={n_area_hectares}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ha</InputAdornment>
                    ),
                    inputComponent: NumericMasking,
                }}
                onChange={event => {
                    const { value } = event.target
                    document
                        .getElementById('n_area_hectares')
                        ?.setAttribute('value', value)
                    clearValidationError({
                        target: { name: 'n_area_hectares' },
                    })
                }}
                error={Boolean(validationErrors.n_area_hectares)}
                helperText={validationErrors.n_area_hectares}
            />

            <TextField
                fullWidth
                disabled={isLoading}
                label="LAND ID (REA)"
                margin="dense"
                name="rea_land_id"
                defaultValue={rea_land_id}
                onChange={clearValidationError}
                error={Boolean(validationErrors.rea_land_id)}
                helperText={validationErrors.rea_land_id}
            />

            {/* @ts-ignore */}
            <DatePicker
                fullWidth
                disabled={isLoading}
                margin="dense"
                label="Tanggal Tanam"
                name="planted_at"
                defaultValue={planted_at}
                onChange={() =>
                    clearValidationError({ target: { name: 'planted_at' } })
                }
                error={Boolean(validationErrors.planted_at)}
                helperText={validationErrors.planted_at}
            />

            {/* @ts-ignore */}
            <SelectInputFromApi
                required
                disabled={isLoading}
                margin="dense"
                name="farmer_group_uuid"
                selectProps={{
                    defaultValue: farmer_group_uuid || '',
                }}
                endpoint="/data/farmer-groups"
                label="Kelompok Tani"
            />

            <input
                type="hidden"
                name="region_id"
                defaultValue={getRegion(address)?.id}
            />

            {/* @ts-ignore */}
            <Autocomplete
                required
                disabled={isLoading}
                margin="dense"
                defaultValue={getRegion(address)}
                onChange={(e: any, value: any) => {
                    document
                        .querySelector('input[name="region_id"]')
                        ?.setAttribute('value', value?.id)
                    clearValidationError({ target: { name: 'region_id' } })
                }}
                endpoint="/select2/administrative-regions"
                label="Wilayah Administratif"
            />

            <TextField
                fullWidth
                disabled={isLoading}
                multiline
                margin="dense"
                name="detail"
                label="Alamat Lengkap"
                defaultValue={address?.detail}
                error={Boolean(validationErrors.detail)}
                onChange={clearValidationError}
                helperText={validationErrors.detail}
            />

            <TextField
                fullWidth
                disabled={isLoading}
                margin="dense"
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
                defaultValue={address?.zip_code}
                error={Boolean(validationErrors.zip_code)}
                onChange={clearValidationError}
                helperText={validationErrors.zip_code}
            />

            <TextField
                fullWidth
                disabled={isLoading}
                multiline
                rows={2}
                label="Catatan tambahan"
                margin="dense"
                name="note"
                defaultValue={note}
                onChange={clearValidationError}
                error={Boolean(validationErrors.note)}
                helperText={validationErrors.note}
            />

            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button disabled={isLoading} color="error">
                    Hapus
                </Button>

                <div>
                    <Button
                        disabled={isLoading}
                        type="reset"
                        color="info"
                        onClick={onCancel}>
                        Batal
                    </Button>
                    <LoadingButton
                        type="submit"
                        loading={isLoading}
                        variant="contained"
                        color="info">
                        Simpan
                    </LoadingButton>
                </div>
            </Box>
        </form>
    )
}

export default UserLandForm
