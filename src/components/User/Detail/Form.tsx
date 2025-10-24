// types

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/GridLegacy'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import dayjs from 'dayjs'
import type { FormEvent } from 'react'
// vendors
import { useState } from 'react'
import { PatternFormat } from 'react-number-format'
import { mutate } from 'swr'
import DatePicker from '@/components/DatePicker'
import SelectFromApi from '@/components/Global/SelectFromApi'
// components
import Autocomplete from '@/components/Inputs/Autocomplete'
import ImageInput from '@/components/image-input'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import MaritalStatusEnum from '@/enums/marital-status'
// hooks
import useValidationErrors from '@/hooks/useValidationErrors'
import axios from '@/lib/axios'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import type UserDetailORM from '@/modules/user/types/orms/user-detail'
// providers
import useFormData from '@/providers/FormData'
import type DistrictType from '@/types/orms/district'
import type RegencyType from '@/types/orms/regency'
import type VillageType from '@/types/orms/village'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

function getBirthRegion(userDetail?: UserDetailORM) {
    return (
        userDetail?.birth_village ??
        userDetail?.birth_district ??
        userDetail?.birth_regency ??
        null
    )
}

export default function UserDetailForm() {
    const { data: userWithDetails } = useUserDetailSwr()
    const { data, handleClose } = useFormData()

    const userDetail = data as UserDetailORM

    const [gender, setGender] = useState<string>()
    const [birthRegion, setBirthRegion] = useState(getBirthRegion(userDetail))
    const [lastEducationId, setLastEducationId] = useState()
    const [maritalStatusId, setMaritalStatusId] = useState<MaritalStatusEnum>()
    const [isLoading, setIsLoading] = useState(false)

    const { validationErrors, setValidationErrors, clearByEvent, clearByName } =
        useValidationErrors()

    const { user_uuid, files = [] } = userDetail ?? {}

    const pasFoto = files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = files.find(file => file.alias === 'Foto KTP')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
                `/users/${user_uuid ?? userWithDetails?.uuid}/detail`,
                formData,
            )
            .then(() => {
                mutate(`users/${user_uuid ?? userWithDetails?.uuid}`)
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
        <form autoComplete="off" onSubmit={handleSubmit}>
            <ImageInput
                disabled={isLoading}
                label="Pas Foto"
                name="pas_foto"
                onChange={clearByEvent}
                value={pasFoto}
                {...errorsToHelperTextObj(
                    validationErrors.pas_foto ??
                        validationErrors.pas_foto_capture,
                )}
            />

            <PatternFormat
                customInput={TextField}
                defaultValue={userDetail?.citizen_id ?? ''}
                disabled={isLoading}
                format="#### #### #### ####"
                label="Nomor Induk Kependudukan"
                maxLength={16}
                minLength={15}
                name="citizen_id"
                onChange={clearByEvent}
                {...errorsToHelperTextObj(validationErrors.citizen_id)}
            />

            <ImageInput
                disabled={isLoading}
                label="Foto KTP"
                name="foto_ktp"
                onChange={clearByEvent}
                sx={{
                    mt: 2,
                }}
                value={fotoKtp}
                {...errorsToHelperTextObj(
                    validationErrors.foto_ktp ??
                        validationErrors.foto_ktp_capture,
                )}
            />

            <FormControl
                disabled={isLoading}
                error={Boolean(validationErrors.gender_id)}
                fullWidth
                margin="normal">
                <FormLabel>Jenis Kelamin</FormLabel>

                <RadioGroup
                    name="gender_id"
                    onChange={event => {
                        const { value } = event.target

                        clearByEvent(event)
                        setGender(value)
                    }}
                    value={gender ?? userDetail?.gender_id ?? null}>
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
                defaultValue={birthRegion?.id ?? ''}
                name="birth_region_id"
                type="hidden"
            />

            <Autocomplete
                disabled={isLoading}
                endpoint={`/select2/administrative-regions`}
                label="Tempat Lahir"
                onChange={(
                    _,
                    value: DistrictType | RegencyType | VillageType,
                ) => setBirthRegion(value)}
                required={false}
                value={birthRegion}
            />

            <DatePicker
                defaultValue={
                    userDetail?.birth_at ? dayjs(userDetail.birth_at) : null
                }
                disabled={isLoading}
                slotProps={{
                    textField: {
                        label: 'Tanggal Lahir',
                        name: 'birth_at',
                        required: false,
                        ...errorsToHelperTextObj(validationErrors.birth_at),
                    },
                }}
            />

            <TextField
                defaultValue={userDetail?.bpjs_kesehatan_no ?? ''}
                disabled={isLoading}
                label="Nomor BPJS Kesehatan"
                name="bpjs_kesehatan_no"
                onChange={clearByEvent}
                required={false}
                {...errorsToHelperTextObj(validationErrors.bpjs_kesehatan_no)}
            />

            <TextField
                defaultValue={userDetail?.job_title ?? ''}
                disabled={isLoading}
                label="Pekerjaan"
                name="job_title"
                onChange={clearByEvent}
                required={false}
                {...errorsToHelperTextObj(validationErrors.job_title)}
            />

            <TextField
                defaultValue={userDetail?.job_desc ?? ''}
                disabled={isLoading}
                label="Deskripsi Pekerjaan"
                multiline
                name="job_desc"
                onChange={clearByEvent}
                required={false}
                rows={2}
                {...errorsToHelperTextObj(validationErrors.job_desc)}
            />

            <SelectFromApi
                disabled={isLoading}
                endpoint="/data/educations"
                fullWidth
                label="Pendidikan Terakhir"
                margin="dense"
                onValueChange={value => {
                    clearByName('last_education_id')
                    setLastEducationId(value.id)
                }}
                selectProps={{
                    name: 'last_education_id',
                    value:
                        lastEducationId ?? userDetail?.last_education_id ?? '',
                }}
                size="small"
                {...errorsToHelperTextObj(validationErrors.last_education_id)}
            />

            <Grid columnSpacing={2} container>
                <Grid item sm={6} xs={12}>
                    <SelectFromApi
                        disabled={isLoading}
                        endpoint="/data/marital-statuses"
                        fullWidth
                        label="Status Pernikahan"
                        margin="dense"
                        onValueChange={value => {
                            clearByName('marital_status_id')
                            setMaritalStatusId(value.id)
                        }}
                        selectProps={{
                            name: 'marital_status_id',
                            value:
                                maritalStatusId ??
                                userDetail?.marital_status_id ??
                                '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(
                            validationErrors.marital_status_id,
                        )}
                    />
                </Grid>

                <Grid item sm={6} xs={12}>
                    <NumericFormat
                        decimalScale={0}
                        defaultValue={userDetail?.n_children ?? ''}
                        disabled={isLoading}
                        inputProps={{}}
                        label="Jumlah Anak"
                        maxLength={2}
                        name="n_children"
                        onChange={clearByEvent}
                        required={false}
                        {...errorsToHelperTextObj(validationErrors.n_children)}
                    />
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="end" mt={2}>
                <Button
                    color="info"
                    disabled={isLoading}
                    onClick={() => handleClose()}>
                    Batal
                </Button>

                <Button
                    color="info"
                    loading={isLoading}
                    type="submit"
                    variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
