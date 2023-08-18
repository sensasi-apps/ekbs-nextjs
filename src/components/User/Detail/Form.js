import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import TextField from '@mui/material/TextField'

import ImageInput from '@/components/ImageInput'
import DatePicker from '@/components/DatePicker'
import SelectInputFromApi from '@/components/SelectInputFromApi'
import Autocomplete from '@/components/Inputs/Autocomplete'
import NumericMasking from '@/components/Inputs/NumericMasking'

import useFormData from '@/providers/FormData'
import { LoadingButton } from '@mui/lab'
import useUserWithDetails from '@/providers/UserWithDetails'

const getBirthRegion = userDetail => {
    return (
        userDetail?.birth_village ||
        userDetail?.birth_district ||
        userDetail?.birth_regency ||
        null
    )
}

const UserDetailForm = () => {
    const { data: userWithDetails } = useUserWithDetails()
    const { data: userDetail, handleClose } = useFormData()

    const [gender, setGender] = useState(null)
    const [birthRegion, setBirthRegion] = useState(getBirthRegion(userDetail))
    const [lastEducationId, setLastEducationId] = useState(null)
    const [maritalStatusId, setMaritalStatusId] = useState(null)
    const [validationErrors, setValidationErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const { user_uuid, files = [] } = userDetail || {}

    const pasFoto = files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = files.find(file => file.alias === 'Foto KTP')

    const clearValidationError = event => {
        const { name } = event.target

        if (validationErrors[name])
            setValidationErrors(prev => {
                prev[name] = undefined
                return prev
            })
    }

    const handleSubmit = async event => {
        event.preventDefault()

        const formEl = event.target.closest('form')
        if (!formEl.reportValidity()) return

        setIsLoading(true)

        try {
            const formData = new FormData(formEl)

            await axios.post(
                `/users/${user_uuid || userWithDetails.uuid}/detail`,
                formData,
            )
            await mutate(`/users/${user_uuid || userWithDetails.uuid}`)

            handleClose()
        } catch (error) {
            if (error?.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit}>
            <ImageInput
                name="pas_foto"
                label="Pas Foto"
                disabled={isLoading}
                onChange={clearValidationError}
                defaultValue={
                    pasFoto?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}.${pasFoto.extension}`
                        : null
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

            <TextField
                fullWidth
                margin="normal"
                onChange={clearValidationError}
                disabled={isLoading}
                label="Nomor Induk Kependudukan"
                required
                name="citizen_id"
                defaultValue={userDetail?.citizen_id || ''}
                error={Boolean(validationErrors.citizen_id)}
                helperText={validationErrors.citizen_id}
            />

            <ImageInput
                my={1}
                disabled={isLoading}
                defaultValue={
                    fotoKtp?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}.${fotoKtp.extension}`
                        : null
                }
                name="foto_ktp"
                label="Foto KTP"
                error={Boolean(
                    validationErrors.foto_ktp ||
                        validationErrors.foto_ktp_capture,
                )}
                helperText={
                    validationErrors.foto_ktp ||
                    validationErrors.foto_ktp_capture
                }
            />

            <FormControl
                fullWidth
                margin="normal"
                onChange={event => {
                    const { value } = event.target

                    clearValidationError(event)
                    setGender(value)
                }}
                disabled={isLoading}
                error={Boolean(validationErrors.gender_id)}>
                <FormLabel>Jenis Kelamin</FormLabel>

                <RadioGroup
                    name="gender_id"
                    value={gender || userDetail?.gender_id || null}>
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
                margin="normal"
                disabled={isLoading}
                onChange={(e, value) => setBirthRegion(value)}
                value={birthRegion}
                endpoint={`/select2/administrative-regions`}
                label="Tempat Lahir"
            />

            <DatePicker
                fullWidth
                margin="normal"
                disabled={isLoading}
                label="Tanggal Lahir"
                name="birth_at"
                defaultValue={userDetail?.birth_at || null}
                error={Boolean(validationErrors.birth_at)}
                helperText={validationErrors.birth_at}
            />

            <TextField
                fullWidth
                margin="normal"
                disabled={isLoading}
                label="Nomor BPJS Kesehatan"
                name="bpjs_kesehatan_no"
                onChange={clearValidationError}
                defaultValue={userDetail?.bpjs_kesehatan_no || ''}
                error={Boolean(validationErrors.bpjs_kesehatan_no)}
                helperText={validationErrors.bpjs_kesehatan_no}
            />

            <TextField
                fullWidth
                margin="normal"
                disabled={isLoading}
                label="Pekerjaan"
                name="job_title"
                onChange={clearValidationError}
                defaultValue={userDetail?.job_title || ''}
                error={Boolean(validationErrors.job_title)}
                helperText={validationErrors.job_title}
            />

            <TextField
                fullWidth
                multiline
                disabled={isLoading}
                margin="normal"
                label="Deskripsi Pekerjaan"
                name="job_desc"
                onChange={clearValidationError}
                defaultValue={userDetail?.job_desc || ''}
                error={Boolean(validationErrors.job_desc)}
                helperText={validationErrors.job_desc}
            />

            <SelectInputFromApi
                endpoint="/data/educations"
                disabled={isLoading}
                label="Pendidikan Terakhir"
                name="last_education_id"
                margin="normal"
                onChange={e => {
                    const { value } = e.target

                    clearValidationError(e)
                    setLastEducationId(value)
                }}
                selectProps={{
                    value:
                        lastEducationId || userDetail?.last_education_id || '',
                }}
            />

            <Grid container spacing={2} mt={0}>
                <Grid item xs={6}>
                    <SelectInputFromApi
                        endpoint="/data/marital-statuses"
                        disabled={isLoading}
                        label="Status Pernikahan"
                        name="marital_status_id"
                        onChange={e => {
                            const { value } = e.target

                            clearValidationError(e)
                            setMaritalStatusId(value)
                        }}
                        selectProps={{
                            value:
                                maritalStatusId ||
                                userDetail?.marital_status_id ||
                                '',
                        }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Jumlah Anak"
                        disabled={isLoading}
                        name="n_children"
                        onChange={clearValidationError}
                        InputProps={{
                            inputComponent: NumericMasking,
                        }}
                        inputProps={{
                            decimalScale: 0,
                            maxLength: 2,
                        }}
                        defaultValue={userDetail?.n_children || ''}
                        error={Boolean(validationErrors.n_children)}
                        helperText={validationErrors.n_children}
                    />
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="end" mt={2}>
                <Button disabled={isLoading} onClick={handleClose} color="info">
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

export default UserDetailForm
