// vendors
import { memo } from 'react'
// materials
import Typography from '@mui/material/Typography'
// utils
import toDmy from '@/utils/toDmy'
import RentItemRent from '@/dataTypes/RentItemRent'

const HerTaskDetail = memo(function HerTaskDetail({
    data: {
        type,
        for_at,
        by_user,
        inventory_item,
        for_n_units,
        rate_rp_per_unit,
        note,
        heavy_equipment_rent,
    },
}: {
    data: RentItemRent
}) {
    const typeId =
        type === 'personal'
            ? 'Perorangan'
            : type === 'farmer-group'
              ? 'Kelompok Tani'
              : 'Pelayanan Publik'
    return (
        <>
            <Typography fontWeight="bold" component="div" gutterBottom>
                Rincian Tugas
            </Typography>

            <Row label="Jenis" value={typeId} />
            <Row label="Penyewa/PJ" value={by_user?.name ?? ''} />
            <Row label="HP/Telp" value={by_user?.phone_no ?? ''} />
            <Row label="Tanggal" value={for_at ? toDmy(for_at) : ''} />
            <Row label="Unit Alat Berat" value={inventory_item?.name} />
            <Row
                label="Operator"
                value={heavy_equipment_rent?.operated_by_user.name ?? ''}
            />
            <Row label="Pesan Untuk" value={`${for_n_units} H.M`} />
            <Row label="Tarif" value={`${rate_rp_per_unit}/H.M`} />
            <Row label="Catatan" value={note ?? ''} />
        </>
    )
})

export default HerTaskDetail

const Row = ({ label, value }: { label: string; value: string | number }) => (
    <Typography variant="body2" component="div" width="fit-content">
        {label}: <b>{value}</b>
    </Typography>
)
