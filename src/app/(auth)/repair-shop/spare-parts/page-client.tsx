'use client'

// materials
import Chip from '@mui/material/Chip'
// vendors
import { useRef, useState } from 'react'
import SparePartFormDialog, {
    type FormData,
} from '@/app/(auth)/repair-shop/spare-parts/_parts/form-dialog'
// global components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    getNoWrapCellProps,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import FlexBox from '@/components/flex-box'
import TextShortener from '@/components/text-shortener'
import WithDeletedItemsCheckbox from '@/components/with-deleted-items-checkbox'
import type VehicleType from '@/modules/repair-shop/enums/vehicle-type'
// feature scope
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
// utils
import formatNumber from '@/utils/format-number'

let getRowDataRef: {
    current?: GetRowDataType<SparePart>
}

export default function PageClient() {
    const mutateRef = useRef<MutateType<SparePart> | undefined>(undefined)
    const _getRowDataRef = useRef<GetRowDataType<SparePart> | undefined>(
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

            <Datatable<SparePart>
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
                            setFormData({
                                ...data,
                                installment_margin_percent:
                                    data.warehouses[0]
                                        .installment_margin_percent,
                                margin_percent:
                                    data.warehouses[0].margin_percent,
                            } satisfies Required<FormData>)
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

const DATATABLE_COLUMNS: DatatableProps<SparePart>['columns'] = [
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
        label: 'Total QTY',
        name: 'id',
        options: {
            customBodyRender: (_, rowIndex) => {
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
        name: 'warehouses.base_rp_per_unit',
        options: {
            customBodyRender: (_, rowIndex) => {
                const baseRpPerUnit =
                    getRowDataRef.current?.(rowIndex)?.warehouses[0]
                        .base_rp_per_unit ?? 0

                return formatNumber(baseRpPerUnit)
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Harga Jual',
        name: 'warehouses.margin_percent',
        options: {
            customBodyRender: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return '-'

                return (
                    <>
                        <Chip
                            label={data.warehouses[0].margin_percent + '%'}
                            size="small"
                            sx={{
                                mr: 1,
                            }}
                        />
                        {formatNumber(data.warehouses[0].default_sell_price)}
                    </>
                )
            },
            searchable: false,
            setCellProps: getNoWrapCellProps,
            sort: false,
        },
    },
]
