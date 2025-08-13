// vendors
import { useRef, useState } from 'react'
// materials
import Chip from '@mui/material/Chip'
// global components
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/auth-layout'
import TextShortener from '@/components/text-shortener'
// utils
import formatNumber from '@/utils/formatNumber'
// feature scope
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'
import type VehicleType from '@/features/repair-shop--spare-part/enums/vehicle-type'
import SparePartFormDialog, {
    type FormData,
} from '@/features/repair-shop--spare-part/components/form-dialog'

let getRowDataRef: {
    current?: GetRowDataType<SparePart>
}

export default function Page() {
    const mutateRef = useRef<MutateType<SparePart> | undefined>(undefined)
    const _getRowDataRef = useRef<GetRowDataType<SparePart> | undefined>(
        undefined,
    )
    const [formData, setFormData] = useState<FormData>()

    return (
        <AuthLayout title="Data Suku Cadang">
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

            <Datatable<SparePart>
                apiUrl="repair-shop/spare-parts/datatable"
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
                                margin_percent_installment:
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
        </AuthLayout>
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
            customBodyRender: (_, rowIndex) => {
                const data = getRowDataRef.current?.(rowIndex)

                if (!data) return '-'

                return (
                    <>
                        <Chip
                            label={data.warehouses[0].margin_percent + '%'}
                            size="small"
                        />{' '}
                        {formatNumber(data.warehouses[0].default_sell_price)}
                    </>
                )
            },
            searchable: false,
            sort: false,
        },
    },
]
