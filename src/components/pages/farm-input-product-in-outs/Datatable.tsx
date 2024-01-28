// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type ProductMovementType from '@/dataTypes/ProductMovement'
// vendors
import { memo, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, { OnRowClickType, getRowData } from '@/components/Datatable'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import formatNumber from '@/utils/formatNumber'
// enums
import { ApiUrlEnum } from './Datatable.type'
import { ProductMovementTypeEnum } from '@/dataTypes/ProductMovement'

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

            {/* <Chip
                color={getActiveColor(ApiUrlEnum.RETURN)}
                label="Retur"
                onClick={() => setApiUrl(ApiUrlEnum.RETURN)}
            /> */}
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
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'details.product_state',
        label: 'Barang',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductMovementType>(dataIndex)
                if (!data) return ''

                return (
                    <ul
                        style={{
                            margin: 0,
                            paddingLeft: '1em',
                            whiteSpace: 'nowrap',
                        }}>
                        {data.details?.map(
                            ({ id, qty, product_state: { name, unit } }) => (
                                <Typography
                                    key={id}
                                    variant="overline"
                                    component="li"
                                    lineHeight="unset">
                                    {formatNumber(
                                        qty *
                                            (data.type ===
                                            ProductMovementTypeEnum.OPNAME
                                                ? 1
                                                : -1),
                                    )}{' '}
                                    {unit}{' '}
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: name,
                                        }}
                                    />
                                </Typography>
                            ),
                        )}
                    </ul>
                )
            },
        },
    },
    {
        name: 'details',
        label: 'Total Nilai',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData<ProductMovementType>(dataIndex)
                if (!data || !data.details) return ''

                return numberToCurrency(
                    data.details.reduce((acc, curr) => {
                        let qty = Math.abs(curr.qty)
                        let rp_per_unit = curr.rp_per_unit

                        if (data.type === ProductMovementTypeEnum.OPNAME) {
                            qty = curr.qty
                            rp_per_unit =
                                curr.product_state.base_cost_rp_per_unit
                        }

                        return acc + qty * rp_per_unit
                    }, 0),
                )
            },
        },
    },
]
