'use client'

// vendors
import { useRef, useState } from 'react'
// materials
import Chip from '@mui/material/Chip'
// global components
import Datatable, {
    getNoWrapCellProps,
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import FlexBox from '@/components/flex-box'
import Fab from '@/components/Fab'
import TextShortener from '@/components/text-shortener'
import WithDeletedItemsCheckbox from '@/components/with-deleted-items-checkbox'
// utils
import formatNumber from '@/utils/format-number'
// feature scope
import type SparePart from '@/modules/repair-shop/types/orms/spare-part'
import type VehicleType from '@/modules/repair-shop/enums/vehicle-type'
import SparePartFormDialog, {
    type FormData,
} from '@/app/(auth)/repair-shop/spare-parts/_parts/form-dialog'

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

            <FlexBox mb={2} justifyContent="end">
                <WithDeletedItemsCheckbox
                    checked={withDeletedItems}
                    onChange={setWithDeletedItems}
                />
            </FlexBox>

            <Datatable<SparePart>
                download
                apiUrl="repair-shop/spare-parts/datatable"
                apiUrlParams={{
                    withDeletedItems: withDeletedItems ? 1 : 0,
                }}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
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
                                margin_percent:
                                    data.warehouses[0].margin_percent,
                                installment_margin_percent:
                                    data.warehouses[0]
                                        .installment_margin_percent,
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
                                textDecoration: 'line-through',
                                color: 'gray',
                            },
                        },
                    }
                }}
                title="Daftar Suku Cadang"
                tableId="spare-part-datatable"
            />
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<SparePart>['columns'] = [
    {
        name: 'id',
        label: 'ID',
    },
    {
        name: 'code',
        label: 'Kode',
        options: {
            customBodyRender: (value: string) => (
                <TextShortener text={value} maxChar={12} />
            ),
        },
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'vehicle_type',
        label: 'Jenis Kendaraan',
        options: {
            customBodyRender: (value: VehicleType, rowIndex) => {
                const isDeleted = Boolean(
                    getRowDataRef.current?.(rowIndex)?.deleted_at,
                )

                return (
                    <Chip
                        label={value === 'car' ? 'mobil' : 'motor'}
                        color={value === 'car' ? 'success' : 'warning'}
                        disabled={isDeleted}
                        size="small"
                    />
                )
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
    {
        name: 'id',
        label: 'Total QTY',
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
        name: 'warehouses.base_rp_per_unit',
        label: 'HPP',
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
        name: 'warehouses.margin_percent',
        label: 'Harga Jual',
        options: {
            setCellProps: getNoWrapCellProps,
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
            sort: false,
        },
    },
]
