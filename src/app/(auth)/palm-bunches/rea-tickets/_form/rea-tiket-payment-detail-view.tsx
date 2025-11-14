// types

// icons
import InfoIcon from '@mui/icons-material/Info'
// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type PalmBunchesReaTicketORM from '@/modules/palm-bunch/types/orms/palm-bunch-rea-ticket'
import type { Ymd } from '@/types/date-string'
// utils
import toDmy from '@/utils/to-dmy'

export default function ReaTiketPaymentDetailView({
    data,
}: {
    data: PalmBunchesReaTicketORM
}) {
    if (!data?.payment_detail) return null

    return (
        <Box>
            <Typography gutterBottom variant="h6">
                Data Tiket pada Pembayaran REA
                <Typography ml={1} variant="caption">
                    (<i>file</i> &quot;Farmer Name&quot;)
                </Typography>
            </Typography>

            <Row
                comparationValue={toDmy(data.at as Ymd)}
                label="Tanggal Tiket/Timbang"
                value={toDmy(data.payment_detail.weighting_at)}
            />

            <Row
                comparationValue={data.delivery.to_oil_mill_code}
                label="Kode Pabrik"
                value={data.payment_detail.oil_mill_code}
            />

            <Row
                comparationValue={data.ticket_no}
                label="No. Tiket"
                value={data.payment_detail.ticket_no}
            />

            <Row
                comparationValue={data.wb_ticket_no}
                label="No. Tiket Timbang"
                value={data.payment_detail.wb_ticket_no}
            />

            <Row
                comparationValue={data.delivery.vehicle_no}
                label="No. Kendaraan"
                value={data.payment_detail.vehicle_no}
            />

            <Row
                comparationValue={data.delivery.n_bunches ?? 0}
                label="Total Janjang"
                value={data.payment_detail.gross_bunches}
            />

            <Row
                comparationValue={data.delivery.n_kg ?? 0}
                label="Total Bobot"
                value={data.payment_detail.gross_kg}
            />

            <Row
                comparationValue={data.rate?.rp_per_kg ?? 0}
                label="Harga TBS"
                value={data.payment_detail.price_rp}
            />

            <Row
                comparationValue={data.delivery.palm_bunches
                    .map(palmBunch => palmBunch.owner_user?.name)
                    .join(', ')}
                label="Nama Petani"
                value={data.payment_detail?.farmer_name ?? ''}
            />
        </Box>
    )
}

function Row({
    label,
    value,
    comparationValue,
}: {
    label: string
    value: string | number
    comparationValue: string | number
}) {
    const isEqual =
        comparationValue.toString().toLowerCase() ===
        value.toString().toLowerCase()

    return (
        <Tooltip
            arrow
            disableHoverListener={isEqual}
            placement="right"
            sx={{
                textDecoration: isEqual ? 'none' : 'underline',
                textDecorationStyle: 'dashed',
            }}
            title={`${label} tidak sesuai dengan data yang di-input`}>
            <Typography component="div" variant="body2" width="fit-content">
                {label}: <b>{value}</b>
                {!isEqual && <InfoIcon color="warning" fontSize="small" />}
            </Typography>
        </Tooltip>
    )
}
