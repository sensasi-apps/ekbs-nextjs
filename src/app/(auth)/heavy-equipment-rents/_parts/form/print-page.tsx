import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import formatNumber from '@/utils/format-number'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import type { HeavyEquipmentRentFormValues } from '.'
import DefaultItemDesc from './default-item-desc'

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
                '& > *': {
                    fontSize: '0.7em',
                },
                color: 'black !important',
                textTransform: 'uppercase',
            }}>
            <Box alignItems="center" display="flex" gap={2} my={2}>
                <Image
                    alt="logo"
                    height={0}
                    priority
                    sizes="100vw"
                    src="/assets/pwa-icons/green-transparent.svg"
                    style={{ height: '6em', width: '6em' }}
                    width={0}
                />

                <Box display="flex" flexDirection="column">
                    <Typography fontWeight="bold">
                        {data.is_paid ? 'Nota ' : 'Faktur '}
                        Penyewaan Alat Berat
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
                    boxProps={{ mb: 2 }}
                    desc="Catatan"
                    value={data.note ?? ''}
                />

                <DefaultItemDesc
                    boxProps={{ mt: 1 }}
                    desc="Total Pengerjaan"
                    value={
                        finishedHm
                            ? formatNumber(finishedHm) +
                              ' ' +
                              (data.rate_unit ?? '')
                            : '-'
                    }
                />

                <DefaultItemDesc
                    desc="Tarif"
                    value={numberToCurrency(data.rate_rp_per_unit ?? 0)}
                />

                {finishedHm ? (
                    <>
                        <DefaultItemDesc
                            boxProps={{ mb: 2 }}
                            desc="Metode Pembayaran"
                            value={getPaymentMethodName(data) ?? '-'}
                        />

                        <Typography fontWeight="bold" variant="caption">
                            Total Keseluruhan
                        </Typography>

                        <Typography component="div" variant="h5">
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
                boxProps={{ color: 'success.main' }}
                desc="status"
                value="Selesai"
            />
        )

    if (data.finished_at)
        return (
            <DefaultItemDesc
                boxProps={{ color: 'warning.main' }}
                desc="status"
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
