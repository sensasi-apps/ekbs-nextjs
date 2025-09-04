// types
import type Address from '@/types/orms/address'
// vendors
import {
    useState,
    useCallback,
    type FormEvent,
    type ChangeEvent,
    type SyntheticEvent,
} from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
// components
import Autocomplete from '@/components/Inputs/Autocomplete'
import DatePicker from '@/components/DatePicker'
import SelectFromApi from '@/components/Global/SelectFromApi'
import NumericFormat from '@/components/NumericFormat'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import type LandORM from '@/modules/clm/types/orms/land'

const INITIAL_STATE = {
    n_area_hectares: undefined,
    rea_land_id: undefined,
    planted_at: undefined,
    region_id: undefined,
    detail: undefined,
    zip_code: undefined,
    note: undefined,
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
                type="hidden"
                name="n_area_hectares"
                id="n_area_hectares"
                defaultValue={n_area_hectares}
            />

            <NumericFormat
                disabled={isLoading}
                name="n_area_hectares"
                label="Luas Lahan"
                defaultValue={n_area_hectares}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="start">Ha</InputAdornment>
                    ),
                }}
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
            <DatePicker
                disabled={isLoading}
                defaultValue={planted_at ? dayjs(planted_at) : null}
                slotProps={{
                    textField: {
                        required: false,
                        name: 'planted_at',
                        label: 'Tanggal Tanam',
                        error: Boolean(validationErrors.planted_at),
                        helperText: validationErrors.planted_at,
                        onChange: clearValidationError,
                    },
                }}
            />

            <SelectFromApi
                selectProps={{
                    name: 'farmer_group_uuid',
                    defaultValue: farmer_group_uuid || '',
                    required: true,
                    disabled: isLoading,
                }}
                endpoint="/data/farmer-groups"
                label="Kelompok Tani"
            />

            <input
                type="hidden"
                name="region_id"
                defaultValue={getRegion(address)?.id}
            />
            <Autocomplete
                required
                disabled={isLoading}
                margin="dense"
                defaultValue={getRegion(address)}
                onChange={(ev, value) => {
                    document
                        .querySelector('input[name="region_id"]')
                        ?.setAttribute('value', value?.id ?? '')

                    clearValidationError(ev)
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

            <NumericFormat
                fullWidth
                disabled={isLoading}
                margin="dense"
                name="zip_code"
                label="Kode Pos"
                defaultValue={address?.zip_code}
                thousandSeparator={false}
                decimalScale={0}
                maxLength={5}
                onChange={clearValidationError}
                {...errorsToHelperTextObj(validationErrors.zip_code)}
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
                    <Button
                        type="submit"
                        loading={isLoading}
                        variant="contained"
                        color="info">
                        Simpan
                    </Button>
                </div>
            </Box>
        </form>
    )
}
