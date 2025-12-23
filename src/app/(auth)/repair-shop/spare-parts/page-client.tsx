'use client'

// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
// vendors
import { useRef, useState } from 'react'
import SparePartFormDialog, {
    type FormData,
} from '@/app/(auth)/repair-shop/spare-parts/_parts/form-dialog'
// global components
import Datatable, {
    type DataTableProps,
    type GetRowDataType,
    getNoWrapCellProps,
    type MutateType,
} from '@/components/data-table'
import Fab from '@/components/fab'
import FlexBox from '@/components/flex-box'
import TextShortener from '@/components/text-shortener'
import WithDeletedItemsCheckbox from '@/components/with-deleted-items-checkbox'
import type VehicleType from '@/modules/repair-shop/enums/vehicle-type'
// feature scope
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
// utils
import formatNumber from '@/utils/format-number'

interface ApiDataType extends SparePart {
    base_rp_per_unit: number
    default_sell_price: number
    default_installment_1_price: number
    default_installment_2_price: number
    qty: number
    margin_percent: number
    installment_margin_percent: number
}

let getRowDataRef: {
    current?: GetRowDataType<ApiDataType>
}

export default function PageClient() {
    const mutateRef = useRef<MutateType<ApiDataType> | undefined>(undefined)
    const _getRowDataRef = useRef<GetRowDataType<ApiDataType> | undefined>(
        undefined,
    )
    const [formData, setFormData] = useState<FormData>()
    const [withDeletedItems, setWithDeletedItems] = useState<boolean>(false)

    return (
        <>
            <Fab
                in={!formData}
                onClick={() =>
                    setFormData({
                        unit: 'pcs',
                    })
                }
            />

            <SparePartFormDialog
                formData={formData}
                handleClose={() => {
                    setFormData(undefined)
                    mutateRef.current?.()
                }}
            />

            <FlexBox justifyContent="end" mb={2}>
                <WithDeletedItemsCheckbox
                    checked={withDeletedItems}
                    onChange={setWithDeletedItems}
                />
            </FlexBox>

            <Datatable<ApiDataType>
                apiUrl="repair-shop/spare-parts/datatable"
                apiUrlParams={{
                    withDeletedItems: withDeletedItems ? 1 : 0,
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'asc', name: 'name' }}
                download
                getRowDataCallback={fn => {
                    _getRowDataRef.current = fn
                    getRowDataRef = _getRowDataRef
                }}
                mutateCallback={mutate => (mutateRef.current = mutate)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (data) {
                            setFormData(data)
                        }
                    }
                }}
                setRowProps={(_, dataIndex) => {
                    const isDeleted =
                        getRowDataRef.current?.(dataIndex)?.deleted_at

                    if (!isDeleted) return {}

                    return {
                        sx: {
                            '& td': {
                                color: 'gray',
                                textDecoration: 'line-through',
                            },
                        },
                    }
                }}
                tableId="spare-part-datatable"
                title="Daftar Suku Cadang"
            />
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps<ApiDataType>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'Kode',
        name: 'code',
        options: {
            customBodyRender: (value: string) => (
                <TextShortener maxChar={12} text={value} />
            ),
        },
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        label: 'Kategori',
        name: 'category',
    },
    {
        label: 'Jenis Kendaraan',
        name: 'vehicle_type',
        options: {
            customBodyRender: (value: VehicleType, rowIndex) => {
                const isDeleted = Boolean(
                    getRowDataRef.current?.(rowIndex)?.deleted_at,
                )

                return (
                    <Chip
                        color={value === 'car' ? 'success' : 'warning'}
                        disabled={isDeleted}
                        label={value === 'car' ? 'mobil' : 'motor'}
                        size="small"
                    />
                )
            },
        },
    },
    {
        label: 'Catatan',
        name: 'note',
    },
    {
        label: 'QTY',
        name: 'qty',
        options: {
            customBodyRenderLite: (_, rowIndex) => {
                const totalQty =
                    getRowDataRef
                        .current?.(rowIndex)
                        ?.warehouses?.reduce((acc, { qty }) => acc + qty, 0) ??
                    0

                return formatNumber(totalQty, { maximumFractionDigits: 0 })
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'HPP',
        name: 'base_rp_per_unit',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Harga Jual',
        name: 'default_sell_price',
        options: {
            customBodyRenderLite: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return '-'

                return (
                    <>
                        <Chip
                            label={data.margin_percent + '%'}
                            size="small"
                            sx={{
                                mr: 1,
                            }}
                        />
                        {formatNumber(data.default_sell_price)}
                    </>
                )
            },
            searchable: false,
            setCellProps: getNoWrapCellProps,
            sort: false,
        },
    },
    {
        label: 'Harga Angsuran 1x',
        name: 'default_installment_1_price',
        options: {
            customBodyRenderLite: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return '-'

                const {
                    margin_percent,
                    installment_margin_percent,
                    base_rp_per_unit,
                } = data

                const finalRp =
                    (base_rp_per_unit *
                        (100 + margin_percent + installment_margin_percent)) /
                    100

                return (
                    <FlexBox>
                        <Chip
                            label={`${margin_percent + installment_margin_percent}%`}
                            size="small"
                        />

                        <Box>
                            {formatNumber(Math.ceil(finalRp))}
                            <Typography
                                color="success"
                                component="div"
                                variant="caption">
                                + {installment_margin_percent}%
                            </Typography>
                        </Box>
                    </FlexBox>
                )
            },
            searchable: false,
            setCellProps: getNoWrapCellProps,
            sort: false,
        },
    },

    {
        label: 'Harga Angsuran 2x',
        name: 'default_installment_2_price',
        options: {
            customBodyRenderLite: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return '-'

                const {
                    margin_percent,
                    installment_margin_percent,
                    base_rp_per_unit,
                } = data

                const finalRp =
                    (base_rp_per_unit *
                        (100 +
                            margin_percent +
                            installment_margin_percent * 2)) /
                    100

                return (
                    <FlexBox>
                        <Chip
                            label={`${margin_percent + installment_margin_percent * 2}%`}
                            size="small"
                        />

                        <Box>
                            {formatNumber(Math.ceil(finalRp))}
                            <Typography
                                color="success"
                                component="div"
                                variant="caption">
                                + {installment_margin_percent}% x 2
                            </Typography>
                        </Box>
                    </FlexBox>
                )
            },
            searchable: false,
            setCellProps: getNoWrapCellProps,
            sort: false,
        },
    },
]
