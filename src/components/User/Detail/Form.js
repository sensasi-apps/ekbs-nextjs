import { useState } from 'react'

import moment from 'moment'
import axios from '@/lib/axios'
import { mutate } from 'swr'

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
import LoadingCenter from '@/components/Statuses/LoadingCenter'
import SelectInputFromApi from '@/components/SelectInputFromApi'
import Autocomplete from '@/components/Inputs/Autocomplete'
import NumericMasking from '@/components/Inputs/NumericMasking'

export default function UserDetailForm({
    isShow = true,
    onSubmitted = () => null,
    onClose = () => null,
    data: userDetail,
    uuid,
    ...props
}) {
    if (!isShow) return null

    const getBirthRegion = userDetail => {
        return (
            userDetail?.birth_village ||
            userDetail?.birth_district ||
            userDetail?.birth_regency ||
            null
        )
    }

    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [birthAt, setBirthAt] = useState(
        userDetail?.birth_at ? moment(userDetail.birth_at) : null,
    )

    const pasFoto = userDetail?.files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = userDetail?.files.find(file => file.alias === 'Foto KTP')

    const handleBirthAtChange = value => {
        setBirthAt(value)
        setErrors({
            ...errors,
            birth_at: null,
        })
    }

    const handleSubmit = async event => {
        event.preventDefault()
        setIsLoading(true)

        try {
            const formData = new FormData(event.target.closest('form'))

            if (birthAt) {
                formData.set('birth_at', birthAt.format('YYYY-MM-DD'))
            }

            await axios.post(`/users/${uuid}/detail`, formData)
            await mutate(`/users/${uuid}`)

            onSubmitted()
        } catch (error) {
            if (error?.response?.status === 422) {
                setErrors(error?.response?.data?.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    if (isLoading) return <LoadingCenter />

    return (
        <form {...props}>
            <ImageInput
                name="pas_foto"
                label="Pas Foto"
                defaultValue={
                    pasFoto?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}`
                        : null
                }
                error={Boolean(errors.pas_foto || errors.pas_foto_capture)}
                helperText={errors.pas_foto || errors.pas_foto_capture}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Nomor Induk Kependudukan"
                name="citizen_id"
                defaultValue={userDetail?.citizen_id || ''}
                error={Boolean(errors.citizen_id)}
                helperText={errors.citizen_id}
            />

            <ImageInput
                my={1}
                defaultValue={
                    fotoKtp?.uuid
                        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}`
                        : null
                }
                name="foto_ktp"
                label="Foto KTP"
                error={Boolean(errors.foto_ktp || errors.foto_ktp_capture)}
                helperText={errors.foto_ktp || errors.foto_ktp_capture}
            />

            <FormControl
                fullWidth
                margin="normal"
                error={Boolean(errors.gender_id)}>
                <FormLabel>Jenis Kelamin</FormLabel>

                <RadioGroup
                    name="gender_id"
                    defaultValue={userDetail?.gender_id || ''}>
                    <FormControlLabel
                        control={<Radio value={1} />}
                        label="Laki-laki"
                    />
                    <FormControlLabel
                        control={<Radio value={2} />}
                        label="Perempuan"
                    />
                </RadioGroup>

                {Boolean(errors.gender_id) && (
                    <FormHelperText>{errors.gender_id}</FormHelperText>
                )}
            </FormControl>

            <input
                type="hidden"
                name="birth_region_id"
                defaultValue={getBirthRegion(userDetail)?.id || ''}
            />

            <Autocomplete
                margin="normal"
                onChange={(e, value) => {
                    document.querySelector(
                        'input[name="birth_region_id"]',
                    ).value = value?.id || ''
                }}
                defaultValue={getBirthRegion(userDetail)}
                endpoint={`/select2/administrative-regions`}
                label="Tempat Lahir"
            />

            <DatePicker
                fullWidth
                margin="normal"
                label="Tanggal Lahir"
                name="birth_at"
                defaultValue={
                    userDetail?.birth_at ? moment(userDetail.birth_at) : null
                }
                onChange={handleBirthAtChange}
                error={Boolean(errors.birth_at)}
                helperText={errors.birth_at}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Nomor BPJS Kesehatan"
                name="bpjs_kesehatan_no"
                defaultValue={userDetail?.bpjs_kesehatan_no || ''}
                error={Boolean(errors.bpjs_kesehatan_no)}
                helperText={errors.bpjs_kesehatan_no}
            />

            <TextField
                fullWidth
                margin="normal"
                label="Pekerjaan"
                name="job_title"
                defaultValue={userDetail?.job_title || ''}
                error={Boolean(errors.job_title)}
                helperText={errors.job_title}
            />

            <TextField
                fullWidth
                multiline
                margin="normal"
                label="Deskripsi Pekerjaan"
                name="job_desc"
                defaultValue={userDetail?.job_desc || ''}
                error={Boolean(errors.job_desc)}
                helperText={errors.job_desc}
            />

            <SelectInputFromApi
                endpoint="/data/educations"
                label="Pendidikan Terakhir"
                name="last_education_id"
                margin="normal"
                selectProps={{
                    defaultValue: userDetail?.last_education_id || '',
                }}
            />

            <Grid container spacing={2} mt={0}>
                <Grid item xs={6}>
                    <SelectInputFromApi
                        endpoint="/data/marital-statuses"
                        label="Status Pernikahan"
                        name="marital_status_id"
                        selectProps={{
                            defaultValue: userDetail?.marital_status_id || '',
                        }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Jumlah Anak"
                        name="n_children"
                        InputProps={{
                            inputComponent: NumericMasking,
                        }}
                        inputProps={{
                            decimalScale: 0,
                            maxLength: 2,
                        }}
                        defaultValue={userDetail?.n_children || ''}
                        error={Boolean(errors.n_children)}
                        helperText={errors.n_children}
                    />
                </Grid>
            </Grid>

            <Box display="flex" justifyContent="end" mt={2}>
                <Button onClick={() => onClose()} color="info">
                    Batal
                </Button>
                <Button onClick={handleSubmit} color="info" variant="contained">
                    Simpan
                </Button>
            </Box>
        </form>
    )
}
