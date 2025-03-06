// vendors
import { useRef, useState } from 'react'
// materials
import Chip from '@mui/material/Chip'
//
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
import type VehicleType from '@/enums/db-columns/repair-shop/spare-part/vehicle-type'
import SparePartFormDialog from '@/components/pages/repair-shop/spare-part/form-dialog'
import type SparePart from '@/@types/Data/repair-shop/spare-part'
import TextShortener from '@/components/text-shortener'
import formatNumber from '@/utils/formatNumber'

export default function Page() {
    const mutateRef = useRef<MutateType<SparePart>>()
    const getRowDataRef = useRef<GetRowDataType<SparePart>>()
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
                handleClose={() => setFormData(undefined)}
                onSuccess={() => {
                    setFormData(undefined)
                    mutateRef.current?.()
                }}
            />

            <Datatable<SparePart>
                apiUrl="repair-shop/spare-part/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={mutate => (mutateRef.current = mutate)}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowDataRef.current?.(dataIndex)

                        if (data) {
                            setFormData(data)
                        }
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
            customBodyRender: (value: VehicleType) => (
                <Chip label={value} size="small" />
            ),
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
            customBodyRender: (value: number, _, __, { data }) => {
                const general_base_rp_per_unit =
                    (data[0]?.data[4] as number) ?? 0

                if (general_base_rp_per_unit === 0) return '-'

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
