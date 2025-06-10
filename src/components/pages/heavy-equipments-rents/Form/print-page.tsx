import type { HeavyEquipmentRentFormValues } from '../Form'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import DefaultItemDesc from './default-item-desc'
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'
import numberToCurrency from '@/utils/numberToCurrency'

export default function PrintPage({
    data,
}: {
    data: HeavyEquipmentRentFormValues
}) {
    const finishedHm = data.heavy_equipment_rent
        ? (data.heavy_equipment_rent.end_hm ?? 0) -
          (data.heavy_equipment_rent.start_hm ?? 0)
        : undefined
    return (
        <Box
            sx={{
                color: 'black !important',
                textTransform: 'uppercase',
                '& > *': {
                    fontSize: '0.7em',
                },
            }}>
            <Box display="flex" gap={2} alignItems="center" my={2}>
                <Image
                    src="/assets/pwa-icons/green-transparent.svg"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                    priority
                />

                <Box display="flex" flexDirection="column">
                    <Typography fontWeight="bold">
                        Nota Penyewaan Alat Berat
                    </Typography>

                    <Typography variant="caption">
                        {process.env.NEXT_PUBLIC_APP_NAME}
                    </Typography>

                    <Typography gutterBottom variant="caption">
                        {data.uuid}
                    </Typography>
                </Box>
            </Box>

            <Box>
                {data.short_uuid && (
                    <DefaultItemDesc desc="Kode" value={data.short_uuid} />
                )}

                {getRentStatus(data)}

                <DefaultItemDesc desc="Jenis" value={getTypeId(data.type)} />

                <DefaultItemDesc
                    desc="Penyewa/PJ"
                    value={data.by_user?.name ?? ''}
                />

                <DefaultItemDesc
                    desc="Sewa TGL"
                    value={data.for_at ? toDmy(data.for_at) : ''}
                />

                <DefaultItemDesc
                    desc="Unit Alat Berat"
                    value={data.inventory_item?.name ?? ''}
                />

                <DefaultItemDesc
                    desc="Operator"
                    value={data.operated_by_user?.name ?? ''}
                />

                <DefaultItemDesc
                    desc="Pesan Untuk"
                    value={
                        (data.for_n_units ?? '') + ' ' + (data.rate_unit ?? '')
                    }
                />

                <DefaultItemDesc
                    desc="Catatan"
                    value={data.note ?? ''}
                    boxProps={{ mb: 2 }}
                />

                <DefaultItemDesc
                    desc="Total Pengerjaan"
                    value={
                        finishedHm
                            ? formatNumber(finishedHm) +
                              ' ' +
                              (data.rate_unit ?? '')
                            : '-'
                    }
                    boxProps={{ mt: 1 }}
                />

                <DefaultItemDesc
                    desc="Tarif"
                    value={numberToCurrency(data.rate_rp_per_unit ?? 0)}
                />

                {finishedHm ? (
                    <>
                        <DefaultItemDesc
                            desc="Metode Pembayaran"
                            value={getPaymentMethodName(data) ?? '-'}
                            boxProps={{ mb: 2 }}
                        />

                        <Typography variant="caption" fontWeight="bold">
                            Total Keseluruhan
                        </Typography>

                        <Typography variant="h5" component="div">
                            {numberToCurrency(
                                finishedHm * (data.rate_rp_per_unit ?? 0),
                            )}
                        </Typography>
                    </>
                ) : null}
            </Box>
        </Box>
    )
}

function getTypeId(type: HeavyEquipmentRentFormValues['type']): string {
    switch (type) {
        case 'personal':
            return 'Perorangan'
        case 'farmer-group':
            return 'Kelompok Tani'
        case 'public-service':
            return 'Pelayanan Publik'
    }

    return ''
}

function getRentStatus(data: HeavyEquipmentRentFormValues) {
    if (data.is_paid)
        return (
            <DefaultItemDesc
                desc="status"
                boxProps={{ color: 'success.main' }}
                value="Selesai"
            />
        )

    if (data.finished_at)
        return (
            <DefaultItemDesc
                desc="status"
                boxProps={{ color: 'warning.main' }}
                value="Pekerjaan Selesai / Menunggu Pembayaran"
            />
        )

    return <DefaultItemDesc desc="status" value="Pekerjaan Dijadwalkan" />
}

function getPaymentMethodName(
    data: HeavyEquipmentRentFormValues,
): string | undefined {
    const tx = data.transaction

    if (!tx) return '-'

    if ('farmer_group_cash' in tx && tx.farmer_group_cash)
        return 'Wallet ' + tx.farmer_group_cash.farmer_group.name

    if ('business_unit_cash' in tx && tx.business_unit_cash)
        return 'Wallet ' + tx.business_unit_cash.business_unit?.name

    return data.transaction ? 'Tunai' : 'Angsuran'
}
