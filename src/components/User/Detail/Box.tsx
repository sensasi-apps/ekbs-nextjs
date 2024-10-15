// types
import type { BoxProps } from '@mui/material/Box'
import type File from '@/dataTypes/File'
import type { UserDetailDBTypeWithRelations } from '@/dataTypes/UserDetail'
// vendors
import { PatternFormat } from 'react-number-format'
// materials
import { Box, Typography, Tooltip } from '@mui/material'
// components
import ImageButtonAndModal from '@/components/ImageButtonAndModal'
// utils
import toDmy from '@/utils/toDmy'

export default function UserDetailBox({
    data: userDetail,
}: {
    data: UserDetailDBTypeWithRelations
}) {
    if (!userDetail) return null

    const {
        birth_at,
        birth_regency,
        birth_district,
        bpjs_kesehatan_no,
        citizen_id,
        gender,
        job_desc,
        job_title,
        last_education,
        marital_status,
        n_children,
    } = userDetail

    const files: File[] = userDetail?.files || []

    const pasFoto = files.find(file => file.alias === 'Pas Foto')
    const fotoKtp = files.find(file => file.alias === 'Foto KTP')

    return (
        <Box>
            <Row title="Foto Diri">
                <div>
                    {pasFoto?.uuid ? (
                        <ImageButtonAndModal file={pasFoto} alt="Pas Foto" />
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
                        <ImageButtonAndModal file={fotoKtp} alt="Foto KTP" />
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

                    {birth_at ? ', ' + toDmy(birth_at) : '-'}
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

const getBirthRegion = (userDetail: UserDetailDBTypeWithRelations) =>
    userDetail?.birth_village ||
    userDetail?.birth_district ||
    userDetail?.birth_regency ||
    null

const Row = ({
    title,
    children,
    helperText,
    ...props
}: {
    title: string
    children: React.ReactNode
    helperText?: string
} & BoxProps) => (
    <Box {...props} mb={1}>
        <Typography variant="caption" color="text.secondary">
            {title}
        </Typography>
        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && children}

        {helperText && <Typography variant="body2">{helperText}</Typography>}
    </Box>
)
