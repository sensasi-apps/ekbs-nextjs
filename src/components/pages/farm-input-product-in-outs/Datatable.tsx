// types
import type ProductMovement from '@/types/orms/product-movement'
// vendors
import { memo, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type OnRowClickType,
} from '@/components/Datatable'
// utils
import toDmy from '@/utils/to-dmy'
import numberToCurrency from '@/utils/number-to-currency'
import formatNumber from '@/utils/format-number'
// enums
import { ApiUrlEnum } from './Datatable.type'
import { ProductMovementTypeEnum } from '@/types/orms/product-movement'

let getRowData: GetRowDataType<ProductMovement>

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

                <Datatable<ProductMovement>
                    title="Riwayat"
                    tableId="farm-input-product-in-outs-datatable"
                    apiUrl={apiUrl}
                    onRowClick={onRowClick}
                    columns={DATATABLE_COLUMNS}
                    getRowDataCallback={fn => (getRowData = fn)}
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

const detailsProductStateCustomBodyRenderLite = (dataIndex: number) => {
    const data = getRowData(dataIndex)
    if (!data) return ''

    return (
        <ul
            style={{
                margin: 0,
                paddingLeft: '1em',
                whiteSpace: 'nowrap',
            }}>
            {data.details?.map(
                ({
                    id,
                    qty,
                    rp_per_unit,
                    rp_cost_per_unit,
                    product_state: { name, unit },
                    product_warehouse_state: { base_cost_rp_per_unit },
                }) => {
                    const rpPerUnit =
                        data.type === ProductMovementTypeEnum.OPNAME
                            ? base_cost_rp_per_unit
                            : rp_per_unit + rp_cost_per_unit

                    return (
                        <Typography
                            key={id}
                            variant="overline"
                            component="li"
                            lineHeight="unset">
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: name,
                                }}
                            />{' '}
                            &mdash; {formatNumber(qty)} {unit} &times;{' '}
                            {numberToCurrency(rpPerUnit)} ={' '}
                            {numberToCurrency(qty * rpPerUnit)}
                        </Typography>
                    )
                },
            )}
        </ul>
    )
}

export const DATATABLE_COLUMNS: DatatableProps<ProductMovement>['columns'] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'at',
        label: 'TGL',
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
            customBodyRender: type => (
                <Chip
                    label={type}
                    size="small"
                    variant="outlined"
                    color={
                        type === ProductMovementTypeEnum.PURCHASE
                            ? 'success'
                            : type === ProductMovementTypeEnum.SELL
                              ? 'warning'
                              : type === ProductMovementTypeEnum.OPNAME
                                ? 'info'
                                : undefined
                    }
                />
            ),
        },
    },
    {
        name: 'details.product_state',
        label: 'Barang',
        options: {
            sort: false,
            customBodyRenderLite: detailsProductStateCustomBodyRenderLite,
        },
    },
    {
        name: 'details',
        label: 'Total Nilai',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data || !data.details) return ''

                return numberToCurrency(
                    data.details.reduce(
                        (
                            acc,
                            {
                                qty,
                                rp_per_unit,
                                rp_cost_per_unit,
                                product_warehouse_state: {
                                    base_cost_rp_per_unit,
                                },
                            },
                        ) => {
                            const rpPerUnit =
                                data.type === ProductMovementTypeEnum.OPNAME
                                    ? base_cost_rp_per_unit
                                    : rp_per_unit + rp_cost_per_unit

                            return acc + rpPerUnit * qty
                        },
                        0,
                    ),
                )
            },
        },
    },
]
