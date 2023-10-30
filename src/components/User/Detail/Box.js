import Image from 'next/image'
import moment from 'moment'
import { PatternFormat } from 'react-number-format'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

const getBirthRegion = userDetail => {
    return (
        userDetail?.birth_village ||
        userDetail?.birth_district ||
        userDetail?.birth_regency ||
        null
    )
}

const Row = ({ title, children, helperText, ...props }) => {
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

const UserDetailBox = ({ data: userDetail }) => {
    if (!userDetail) return null

    const {
        birth_at,
        birth_regency,
        birth_district,
        bpjs_kesehatan_no,
        citizen_id,
        files = [],
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
        <Box>
            <Row title="Foto Diri">
                <div>
                    {pasFoto?.uuid ? (
                        <Image
                            unoptimized
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${pasFoto.uuid}.${pasFoto.extension}`}
                            alt="Foto Diri"
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '320px',
                            }}
                            width={320}
                            height={320}
                        />
                    ) : (
                        <i>Foto Diri tidak ditemukan</i>
                    )}
                </div>
            </Row>

            <Row title="NIK">
                <div>
                    <PatternFormat
                        format="#### #### #### ####"
                        displayType="text"
                        value={citizen_id}
                    />
                </div>
            </Row>

            <Row title="Foto KTP">
                <div>
                    {fotoKtp?.uuid ? (
                        <Image
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/file/${fotoKtp.uuid}.${fotoKtp.extension}`}
                            unoptimized
                            alt="Foto KTP"
                            sizes="100vw"
                            style={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: '320px',
                            }}
                            width={320}
                            height={320}
                        />
                    ) : (
                        <i>Foto KTP tidak ditemukan</i>
                    )}
                </div>
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

            <Row title="Nomor BPJS Kesehatan">{bpjs_kesehatan_no || '-'}</Row>

            <Row title="Pekerjaan" helperText={job_desc}>
                {job_title || '-'}
            </Row>

            <Row title="Pendidikan Terakhir">{last_education?.name || '-'}</Row>

            <Row title="Status Pernikahan">{marital_status?.name || '-'}</Row>

            <Row title="Jumlah Anak">
                {n_children === null ? '-' : `${n_children} orang`}
            </Row>
        </Box>
    )
}

export default UserDetailBox
