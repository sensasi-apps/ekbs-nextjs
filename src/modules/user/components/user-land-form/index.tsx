// types

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'
// vendors
import {
    type ChangeEvent,
    type FormEvent,
    type SyntheticEvent,
    useCallback,
    useState,
} from 'react'
import { mutate } from 'swr'
import DatePicker from '@/components/date-picker'
import SelectFromApi from '@/components/Global/SelectFromApi'
// components
import Autocomplete from '@/components/Inputs/Autocomplete'
import NumericFormat from '@/components/NumericFormat'
import axios from '@/lib/axios'
import type LandORM from '@/modules/clm/types/orms/land'
import type Address from '@/types/orms/address'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

const INITIAL_STATE = {
    detail: undefined,
    n_area_hectares: undefined,
    note: undefined,
    planted_at: undefined,
    rea_land_id: undefined,
    region_id: undefined,
    zip_code: undefined,
}

const getRegion = (address?: Address): { id: number } | null => {
    return address?.village || address?.district || address?.regency || null
}

export default function UserLandForm(props: {
    data: LandORM
    userUuid: string
    onCancel: () => void
    isLoading: boolean
    onSubmit: () => void
    setIsLoading: (isLoading: boolean) => void
}) {
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

    const handleSubmit = useCallback(
        (ev: FormEvent<HTMLFormElement>) => {
            ev.preventDefault()

            const formEl = ev.currentTarget
            if (!formEl.reportValidity()) return

            setIsLoading(true)
            const formData = new FormData(formEl)
            const dataFormData = Object.fromEntries(formData.entries())

            dataFormData.planted_at = dayjs(
                dataFormData.planted_at as string,
                'DD-MM-YYYY',
            ).format('YYYY-MM-DD')

            const axiosRequest = data?.uuid
                ? axios.put(
                      `/users/${userUuid}/lands/${data.uuid}`,
                      dataFormData,
                  )
                : axios.post(`/users/${userUuid}/lands`, dataFormData)

            axiosRequest
                .then(() => {
                    mutate(`users/${userUuid}`)
                })
                .catch(err => {
                    if (err.response?.status === 422) {
                        setValidationErrors(err.response.data.errors)
                    } else {
                        throw err
                    }
                })
                .finally(() => {
                    setIsLoading(false)
                    onSubmit()
                })
        },
        [data.uuid, onSubmit, setIsLoading, userUuid],
    )

    const clearValidationError = (
        ev:
            | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            | SyntheticEvent,
    ) => {
        // @ts-expect-error name is not available in SyntheticEvent
        const name = ev.currentTarget.name

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
                defaultValue={n_area_hectares}
                id="n_area_hectares"
                name="n_area_hectares"
                type="hidden"
            />

            <NumericFormat
                defaultValue={n_area_hectares}
                disabled={isLoading}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ha</InputAdornment>
                    ),
                }}
                label="Luas Lahan"
                name="n_area_hectares"
                onChange={event => {
                    const { value } = event.target
                    document
                        .getElementById('n_area_hectares')
                        ?.setAttribute('value', value)
                    clearValidationError(event)
                }}
                {...errorsToHelperTextObj(validationErrors.n_area_hectares)}
            />

            <TextField
                defaultValue={rea_land_id}
                disabled={isLoading}
                error={Boolean(validationErrors.rea_land_id)}
                fullWidth
                helperText={validationErrors.rea_land_id}
                label="LAND ID (REA)"
                margin="dense"
                name="rea_land_id"
                onChange={clearValidationError}
            />
            <DatePicker
                defaultValue={planted_at ? dayjs(planted_at) : null}
                disabled={isLoading}
                slotProps={{
                    textField: {
                        error: Boolean(validationErrors.planted_at),
                        helperText: validationErrors.planted_at,
                        label: 'Tanggal Tanam',
                        name: 'planted_at',
                        onChange: clearValidationError,
                        required: false,
                    },
                }}
            />

            <SelectFromApi
                endpoint="/data/farmer-groups"
                label="Kelompok Tani"
                selectProps={{
                    defaultValue: farmer_group_uuid || '',
                    disabled: isLoading,
                    name: 'farmer_group_uuid',
                    required: true,
                }}
            />

            <input
                defaultValue={getRegion(address)?.id}
                name="region_id"
                type="hidden"
            />
            <Autocomplete
                defaultValue={getRegion(address)}
                disabled={isLoading}
                endpoint="/select2/administrative-regions"
                label="Wilayah Administratif"
                margin="dense"
                onChange={(ev, value) => {
                    document
                        .querySelector('input[name="region_id"]')
                        ?.setAttribute('value', value?.id ?? '')

                    clearValidationError(ev)
                }}
                required
            />
            <TextField
                defaultValue={address?.detail}
                disabled={isLoading}
                error={Boolean(validationErrors.detail)}
                fullWidth
                helperText={validationErrors.detail}
                label="Alamat Lengkap"
                margin="dense"
                multiline
                name="detail"
                onChange={clearValidationError}
            />

            <NumericFormat
                decimalScale={0}
                defaultValue={address?.zip_code}
                disabled={isLoading}
                fullWidth
                label="Kode Pos"
                margin="dense"
                maxLength={5}
                name="zip_code"
                onChange={clearValidationError}
                thousandSeparator={false}
                {...errorsToHelperTextObj(validationErrors.zip_code)}
            />

            <TextField
                defaultValue={note}
                disabled={isLoading}
                error={Boolean(validationErrors.note)}
                fullWidth
                helperText={validationErrors.note}
                label="Catatan tambahan"
                margin="dense"
                multiline
                name="note"
                onChange={clearValidationError}
                rows={2}
            />
            <Box display="flex" justifyContent="space-between" mt={2}>
                <Button color="error" disabled={isLoading}>
                    Hapus
                </Button>

                <div>
                    <Button
                        color="info"
                        disabled={isLoading}
                        onClick={onCancel}
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
                </div>
            </Box>
        </form>
    )
}
