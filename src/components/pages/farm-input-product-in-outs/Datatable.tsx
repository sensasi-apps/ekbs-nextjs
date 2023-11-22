// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductMovementType from '@/dataTypes/ProductMovement'
// vendors
import { memo, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
// components
import Datatable, { OnRowClickType, getDataRow } from '@/components/Datatable'
import { ApiUrlEnum } from './Datatable.type'
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'

const FarmInputProductInOutDatatable = memo(
    function FarmInputProductInOutDatatable({
        onRowClick,
    }: {
        onRowClick?: OnRowClickType
    }) {
        const [apiUrl, setApiUrl] = useState(ApiUrlEnum.ALL)

        return (
            <>
                <FilterBox activeUrl={apiUrl} setApiUrl={setApiUrl} />

                <Datatable
                    title="Riwayat"
                    tableId="farm-input-product-in-outs-datatable"
                    apiUrl={apiUrl}
                    onRowClick={onRowClick}
                    columns={DATATABLE_COLUMNS}
                    defaultSortOrder={{ name: 'at', direction: 'desc' }}
                />
            </>
        )
    },
)

export default FarmInputProductInOutDatatable

function FilterBox({
    activeUrl,
    setApiUrl,
}: {
    activeUrl: ApiUrlEnum
    setApiUrl: (url: ApiUrlEnum) => void
}) {
    const getActiveColor = (url: ApiUrlEnum) =>
        activeUrl === url ? 'success' : undefined

    return (
        <Box display="flex" gap={1} mb={2}>
            <Chip
                color={getActiveColor(ApiUrlEnum.ALL)}
                label="Semua"
                onClick={() => setApiUrl(ApiUrlEnum.ALL)}
            />

            <Chip
                color={getActiveColor(ApiUrlEnum.PURCHASE)}
                label="Pembelian"
                onClick={() => setApiUrl(ApiUrlEnum.PURCHASE)}
            />

            <Chip
                color={getActiveColor(ApiUrlEnum.OPNAME)}
                label="Opname"
                onClick={() => setApiUrl(ApiUrlEnum.OPNAME)}
            />

            <Chip
                color={getActiveColor(ApiUrlEnum.SELL)}
                label="Penjualan"
                onClick={() => setApiUrl(ApiUrlEnum.SELL)}
            />

            <Chip
                color={getActiveColor(ApiUrlEnum.RETURN)}
                label="Retur"
                onClick={() => setApiUrl(ApiUrlEnum.RETURN)}
            />
        </Box>
    )
}

export const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'type',
        label: 'Jenis',
        options: {
            sort: false,
        },
    },
    {
        name: 'details.product',
        label: 'Barang',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getDataRow<ProductMovementType>(dataIndex)
                if (!data) return ''

                return (
                    <ul
                        style={{
                            margin: 0,
                        }}>
                        {data.details?.map(detail => (
                            <li key={detail.product_id}>
                                {detail.product?.name} &mdash;{' '}
                                {formatNumber(detail.qty)}{' '}
                                {detail.product?.unit}
                            </li>
                        ))}
                    </ul>
                )
            },
        },
    },
    {
        name: 'details',
        label: 'Total Nilai',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getDataRow<ProductMovementType>(dataIndex)
                if (!data || !data.details) return ''

                return numberToCurrency(
                    data.details
                        ?.map(detail => detail.qty * detail.rp_per_unit)
                        .reduce((a, b) => a + b, 0),
                )
            },
        },
    },
]
