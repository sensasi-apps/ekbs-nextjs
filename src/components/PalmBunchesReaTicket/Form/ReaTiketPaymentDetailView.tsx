// types
import type { Ymd } from '@/types/DateString'
import type PalmBunchesReaTicket from '@/dataTypes/PalmBunchReaTicket'
// materials
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import InfoIcon from '@mui/icons-material/Info'
// utils
import toDmy from '@/utils/toDmy'

export default function ReaTiketPaymentDetailView({
    data,
}: {
    data: PalmBunchesReaTicket
}) {
    if (!data?.payment_detail) return null

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Data Tiket pada Pembayaran REA
                <Typography variant="caption" ml={1}>
                    (<i>file</i> &quot;Farmer Name&quot;)
                </Typography>
            </Typography>

            <Row
                label="Tanggal Tiket/Timbang"
                value={toDmy(data.payment_detail.weighting_at)}
                comparationValue={toDmy(data.at as Ymd)}
            />

            <Row
                label="Kode Pabrik"
                value={data.payment_detail.oil_mill_code}
                comparationValue={data.delivery.to_oil_mill_code}
            />

            <Row
                label="No. Tiket"
                value={data.payment_detail.ticket_no}
                comparationValue={data.ticket_no}
            />

            <Row
                label="No. Tiket Timbang"
                value={data.payment_detail.wb_ticket_no}
                comparationValue={data.wb_ticket_no}
            />

            <Row
                label="No. Kendaraan"
                value={data.payment_detail.vehicle_no}
                comparationValue={data.delivery.vehicle_no}
            />

            <Row
                label="Total Janjang"
                value={data.payment_detail.gross_bunches}
                comparationValue={data.delivery.n_bunches ?? 0}
            />

            <Row
                label="Total Bobot"
                value={data.payment_detail.gross_kg}
                comparationValue={data.delivery.n_kg ?? 0}
            />

            <Row
                label="Harga TBS"
                value={data.payment_detail.price_rp}
                comparationValue={data.rate?.rp_per_kg ?? 0}
            />

            <Row
                label="Nama Petani"
                value={data.payment_detail?.farmer_name ?? ''}
                comparationValue={data.delivery.palm_bunches
                    .map(palmBunch => palmBunch.owner_user?.name)
                    .join(', ')}
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
            placement="right"
            arrow
            title={`${label} tidak sesuai dengan data yang di-input`}
            disableHoverListener={isEqual}
            sx={{
                textDecoration: isEqual ? 'none' : 'underline',
                textDecorationStyle: 'dashed',
            }}>
            <Typography variant="body2" component="div" width="fit-content">
                {label}: <b>{value}</b>
                {!isEqual && <InfoIcon fontSize="small" color="warning" />}
            </Typography>
        </Tooltip>
    )
}
