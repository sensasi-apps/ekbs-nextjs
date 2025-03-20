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
import AuthLayout from '@/components/Layouts/AuthLayout'
import TextShortener from '@/components/text-shortener'
// utils
import formatNumber from '@/utils/formatNumber'
// feature scope
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'
import type VehicleType from '@/features/repair-shop--spare-part/enums/vehicle-type'
import SparePartFormDialog from '@/features/repair-shop--spare-part/components/form-dialog'

let getRowDataRef: {
    current?: GetRowDataType<SparePart>
}

export default function Page() {
    const mutateRef = useRef<MutateType<SparePart>>()
    const _getRowDataRef = useRef<GetRowDataType<SparePart>>()
    const [formData, setFormData] = useState<Partial<SparePart>>()

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
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
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
        name: 'general_base_rp_per_unit',
        label: 'HPP (Rp)',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'margin_percent_final',
        label: 'Harga Jual',
        options: {
            customBodyRender: (value: number, dataIndex) => {
                const general_base_rp_per_unit =
                    getRowDataRef.current?.(dataIndex)?.general_base_rp_per_unit

                if (!general_base_rp_per_unit) return '-'

                return (
                    <>
                        {general_base_rp_per_unit * (1 + value / 100)}
                        <Chip label={value} size="small" />
                    </>
                )
            },
            searchable: false,
            sort: false,
        },
    },
]
