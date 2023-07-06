'use client'

import { mutate } from 'swr'
import moment from 'moment'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Tooltip } from '@mui/material'

import ImageForm from '@/components/ImageForm'

export default function UserDetailBox({ uuid, userDetail, ...props }) {
    if (!userDetail) return null

    const getBirthRegion = userDetail => {
        return (
            userDetail?.birth_village ||
            userDetail?.birth_district ||
            userDetail?.birth_regency ||
            null
        )
    }

    const {
        birth_at,
        birth_regency,
        birth_district,
        bpjs_kesehatan_no,
        citizen_id,
        files,
        gender,
        job_desc,
        job_title,
        last_education,
        marital_status,
        n_children,
    } = userDetail

    const pasFoto = files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = files.find(file => file.alias === 'Foto KTP')

    return (
        <Box {...props}>
            <Box>
                <Row title="Foto Diri">
                    <ImageForm
                        defaultValue={
                            pasFoto?.uuid
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}`
                                : null
                        }
                        action={`/users/${uuid}/detail/pas-foto-upload`}
                        onSubmitted={() => mutate(`/users/${uuid}`)}
                        name="pas_foto"
                    />
                </Row>

                <Row title="NIK">{citizen_id || '='}</Row>

                <Row title="Foto KTP">
                    <ImageForm
                        defaultValue={
                            fotoKtp?.uuid
                                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}`
                                : null
                        }
                        action={`/users/${uuid}/detail/ktp-upload`}
                        onSubmitted={() => mutate(`/users/${uuid}`)}
                        name="foto_ktp"
                    />
                </Row>

                <Row title="Jenis Kelamin">{gender?.name || '-'}</Row>

                <Row title="Tempat dan Tanggal Lahir">
                    <Typography>
                        <Tooltip
                            placement="top-start"
                            title={
                                <>
                                    <Typography component="p">
                                        {getBirthRegion(userDetail)?.id}
                                    </Typography>
                                    <Typography component="p">
                                        {birth_regency?.name}
                                    </Typography>
                                    <Typography component="p">
                                        {birth_district?.name}
                                    </Typography>
                                </>
                            }>
                            <u>{getBirthRegion(userDetail)?.name}</u>
                        </Tooltip>

                        <i>{getBirthRegion(userDetail) ? '' : 'belum diisi'}</i>

                        {birth_at
                            ? ', ' + moment(birth_at).format('DD MMMM YYYY')
                            : '-'}
                    </Typography>
                </Row>

                <Row title="Nomor BPJS Kesehatan">
                    {bpjs_kesehatan_no || '-'}
                </Row>

                <Row title="Pekerjaan" helperText={job_desc}>
                    {job_title || '-'}
                </Row>

                <Row title="Pendidikan Terakhir">
                    {last_education?.name || '-'}
                </Row>

                <Row title="Status Pernikahan">
                    {marital_status?.name || '-'}
                </Row>

                <Row title="Jumlah Anak">
                    {n_children === null ? '-' : `${n_children} orang`}
                </Row>
            </Box>
        </Box>
    )
}

function Row({ title, children, helperText, ...props }) {
    return (
        <Box {...props} mb={1}>
            <Typography variant="caption" color="text.secondary">
                {title}
            </Typography>
            {typeof children === 'string' && (
                <Typography>{children}</Typography>
            )}

            {typeof children !== 'string' && children}

            {helperText && (
                <Typography variant="body2">{helperText}</Typography>
            )}
        </Box>
    )
}
