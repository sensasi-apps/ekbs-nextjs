// types
import type {
    UserDetailDBTypeWithRelations,
    UserDetailRelationsType,
} from '@/dataTypes/UserDetail'
import type { FormEvent } from 'react'
// vendors
import { useState } from 'react'
import { mutate } from 'swr'
import { PatternFormat } from 'react-number-format'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import LoadingButton from '@mui/lab/LoadingButton'
// components
import Autocomplete from '@/components/Inputs/Autocomplete'
import DatePicker from '@/components/DatePicker'
import DeprecatedImageInput from '@/components/DeprecatedImageInput'
import NumericMasking from '@/components/Inputs/NumericMasking'
import TextField from '@/components/TextField'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import SelectFromApi from '@/components/Global/SelectFromApi'
import MaritalStatusEnum from '@/dataTypes/enums/MaritalStatus'
import DistrictType from '@/dataTypes/District'
import RegencyType from '@/dataTypes/Regency'
import VillageType from '@/dataTypes/Village'

const getBirthRegion = (userDetail?: UserDetailRelationsType) => {
    return (
        userDetail?.birth_village ||
        userDetail?.birth_district ||
        userDetail?.birth_regency ||
        null
    )
}

// eslint-disable-next-line import/no-unused-modules
export default function UserDetailForm() {
    const { data: userWithDetails } = useUserWithDetails()
    const { data, handleClose } = useFormData()

    const userDetail = data as UserDetailDBTypeWithRelations

    const [gender, setGender] = useState<string>()
    const [birthRegion, setBirthRegion] = useState(getBirthRegion(userDetail))
    const [lastEducationId, setLastEducationId] = useState()
    const [maritalStatusId, setMaritalStatusId] = useState<MaritalStatusEnum>()
    const [isLoading, setIsLoading] = useState(false)

    const { validationErrors, setValidationErrors, clearByEvent, clearByName } =
        useValidationErrors()

    const { user_uuid, files = [] } = userDetail || {}

    const pasFoto = files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = files.find(file => file.alias === 'Foto KTP')

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const formEl = event.currentTarget
        if (!formEl.reportValidity()) return

        setIsLoading(true)

        const formData = new FormData(formEl)

        const citizenId = formData.get('citizen_id')
        if (citizenId)
            formData.set('citizen_id', citizenId.toString().replaceAll(' ', ''))

        const birthAt = formData.get('birth_at') as string
        if (birthAt)
            formData.set(
                'birth_at',
                dayjs(birthAt, 'DD-MM-YYYY').format('YYYY-MM-DD'),
            )

        return axios
            .post(
                `/users/${user_uuid || userWithDetails.uuid}/detail`,
                formData,
            )
            .then(() => {
                mutate(`/users/${user_uuid || userWithDetails.uuid}`)
                handleClose()
            })
            .catch(error => {
                if (error?.response?.status === 422)
                    return setValidationErrors(error.response.data.errors)

                throw error
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <form onSubmit={handleSubmit} autoComplete="off">
            <DeprecatedImageInput
                name="pas_foto"
                label="Pas Foto"
                disabled={isLoading}
                onChange={clearByEvent}
                defaultValue={
                    pasFoto?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}.${pasFoto.extension}`
                        : undefined
                }
                error={Boolean(
                    validationErrors.pas_foto ||
                        validationErrors.pas_foto_capture,
                )}
                helperText={
                    validationErrors.pas_foto ||
                    validationErrors.pas_foto_capture
                }
            />

            <PatternFormat
                format="#### #### #### ####"
                customInput={TextField}
                minLength={15}
                maxLength={16}
                onChange={clearByEvent}
                disabled={isLoading}
                label="Nomor Induk Kependudukan"
                name="citizen_id"
                defaultValue={userDetail?.citizen_id || ''}
                error={Boolean(validationErrors.citizen_id)}
                helperText={validationErrors.citizen_id}
            />

            <DeprecatedImageInput
                my={1}
                disabled={isLoading}
                defaultValue={
                    fotoKtp?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}.${fotoKtp.extension}`
                        : undefined
                }
                name="foto_ktp"
                label="Foto KTP"
                {...errorsToHelperTextObj(
                    validationErrors.foto_ktp ??
                        validationErrors.foto_ktp_capture,
                )}
            />

            <FormControl
                fullWidth
                margin="normal"
                disabled={isLoading}
                error={Boolean(validationErrors.gender_id)}>
                <FormLabel>Jenis Kelamin</FormLabel>

                <RadioGroup
                    name="gender_id"
                    value={gender || userDetail?.gender_id || null}
                    onChange={event => {
                        const { value } = event.target

                        clearByEvent(event)
                        setGender(value)
                    }}>
                    <FormControlLabel
                        control={<Radio value={1} />}
                        label="Laki-laki"
                    />
                    <FormControlLabel
                        control={<Radio value={2} />}
                        label="Perempuan"
                    />
                </RadioGroup>

                {Boolean(validationErrors.gender_id) && (
                    <FormHelperText>
                        {validationErrors.gender_id}
                    </FormHelperText>
                )}
            </FormControl>

            <input
                type="hidden"
                name="birth_region_id"
                defaultValue={birthRegion?.id || ''}
            />

            <Autocomplete
                disabled={isLoading}
                required={false}
                onChange={(
                    _,
                    value: DistrictType | RegencyType | VillageType,
                ) => setBirthRegion(value)}
                value={birthRegion}
                endpoint={`/select2/administrative-regions`}
                label="Tempat Lahir"
            />

            <DatePicker
                disabled={isLoading}
                defaultValue={
                    userDetail?.birth_at ? dayjs(userDetail.birth_at) : null
                }
                slotProps={{
                    textField: {
                        required: false,
                        name: 'birth_at',
                        label: 'Tanggal Lahir',
                        ...errorsToHelperTextObj(validationErrors.birth_at),
                    },
                }}
            />

            <TextField
                required={false}
                disabled={isLoading}
                label="Nomor BPJS Kesehatan"
                name="bpjs_kesehatan_no"
                onChange={clearByEvent}
                defaultValue={userDetail?.bpjs_kesehatan_no || ''}
                {...errorsToHelperTextObj(validationErrors.bpjs_kesehatan_no)}
            />

            <TextField
                required={false}
                disabled={isLoading}
                label="Pekerjaan"
                name="job_title"
                onChange={clearByEvent}
                defaultValue={userDetail?.job_title || ''}
                {...errorsToHelperTextObj(validationErrors.job_title)}
            />

            <TextField
                required={false}
                multiline
                rows={2}
                disabled={isLoading}
                label="Deskripsi Pekerjaan"
                name="job_desc"
                onChange={clearByEvent}
                defaultValue={userDetail?.job_desc || ''}
                {...errorsToHelperTextObj(validationErrors.job_desc)}
            />

            <SelectFromApi
                endpoint="/data/educations"
                disabled={isLoading}
                label="Pendidikan Terakhir"
                margin="dense"
                size="small"
                fullWidth
                selectProps={{
                    name: 'last_education_id',
                    value:
                        lastEducationId ?? userDetail?.last_education_id ?? '',
                }}
                onValueChange={value => {
                    clearByName('last_education_id')
                    setLastEducationId(value.id)
                }}
                {...errorsToHelperTextObj(validationErrors.last_education_id)}
            />

            <Grid container columnSpacing={2}>
                <Grid item sm={6} xs={12}>
                    <SelectFromApi
                        endpoint="/data/marital-statuses"
                        disabled={isLoading}
                        label="Status Pernikahan"
                        margin="dense"
                        size="small"
                        fullWidth
                        selectProps={{
                            name: 'marital_status_id',
                            value:
                                maritalStatusId ??
                                userDetail?.marital_status_id ??
                                '',
                        }}
                        onValueChange={value => {
                            clearByName('marital_status_id')
                            setMaritalStatusId(value.id)
                        }}
                        {...errorsToHelperTextObj(
                            validationErrors.marital_status_id,
                        )}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <TextField
                        required={false}
                        label="Jumlah Anak"
                        disabled={isLoading}
                        name="n_children"
                        onChange={clearByEvent}
                        InputProps={{
                            inputComponent: NumericMasking,
                        }}
                        inputProps={{
                            decimalScale: 0,
                            maxLength: 2,
                        }}
                        defaultValue={userDetail?.n_children || ''}
                        {...errorsToHelperTextObj(validationErrors.n_children)}
                    />
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="end" mt={2}>
                <Button
                    disabled={isLoading}
                    onClick={() => handleClose()}
                    color="info">
                    Batal
                </Button>

                <LoadingButton
                    loading={isLoading}
                    type="submit"
                    color="info"
                    variant="contained">
                    Simpan
                </LoadingButton>
            </Box>
        </form>
    )
}
