// types
import type { BoxProps } from '@mui/material/Box'
// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// vendors
import { PatternFormat } from 'react-number-format'
// components
import ImageButtonAndModal from '@/components/ImageButtonAndModal'
import type UserDetailORM from '@/modules/user/types/orms/user-detail'
import type File from '@/types/orms/file'
// utils
import toDmy from '@/utils/to-dmy'

export default function UserDetailBox({
    data: userDetail,
}: {
    data: UserDetailORM
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
        <Box display="flex" flexDirection="column" gap={2}>
            <Row title="Foto Diri">
                {pasFoto?.uuid ? (
                    <ImageButtonAndModal alt="Pas Foto" file={pasFoto} />
                ) : (
                    <Typography color="GrayText" fontStyle="italic">
                        Foto Diri belum diunggah
                    </Typography>
                )}
            </Row>

            <Row title="NIK">
                <PatternFormat
                    displayType="text"
                    format="#### #### #### ####"
                    value={citizen_id}
                />
            </Row>

            <Row title="Foto KTP">
                {fotoKtp?.uuid ? (
                    <ImageButtonAndModal alt="Foto KTP" file={fotoKtp} />
                ) : (
                    <Typography color="GrayText" fontStyle="italic">
                        Foto KTP belum diunggah
                    </Typography>
                )}
            </Row>

            <Row title="Jenis Kelamin">{gender?.name || '-'}</Row>

            <Row title="Tempat dan Tanggal Lahir">
                {getBirthRegion(userDetail) ? (
                    <div>
                        <Tooltip
                            placement="top-start"
                            title={
                                <>
                                    <Typography>
                                        {getBirthRegion(userDetail)?.id}
                                    </Typography>
                                    <Typography>
                                        {birth_regency?.name}
                                    </Typography>
                                    <Typography>
                                        {birth_district?.name}
                                    </Typography>
                                </>
                            }>
                            <u>{getBirthRegion(userDetail)?.name}</u>
                        </Tooltip>

                        <i></i>

                        {birth_at ? `, ${toDmy(birth_at)}` : '-'}
                    </div>
                ) : (
                    <Typography color="GrayText" fontStyle="italic">
                        Belum diisi
                    </Typography>
                )}
            </Row>

            <Row title="Nomor BPJS Kesehatan">{bpjs_kesehatan_no || '-'}</Row>

            <Row helperText={job_desc} title="Pekerjaan">
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

const getBirthRegion = (userDetail: UserDetailORM) =>
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
    <Box {...props}>
        <Typography color="text.secondary" component="div" variant="caption">
            {title}
        </Typography>

        {typeof children === 'string' && <Typography>{children}</Typography>}

        {typeof children !== 'string' && children}

        {helperText && <Typography variant="body2">{helperText}</Typography>}
    </Box>
)
