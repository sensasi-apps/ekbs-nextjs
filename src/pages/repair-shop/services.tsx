// vendors
import { useRef, useState } from 'react'
// materials
import Tooltip from '@mui/material/Tooltip'
// icons
import DeleteIcon from '@mui/icons-material/Delete'
//
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
    type MutateType,
} from '@/components/Datatable'
import Fab from '@/components/Fab'
import AuthLayout from '@/components/Layouts/AuthLayout'
// utils
import formatNumber from '@/utils/formatNumber'
import ServiceFormDialog from '@/features/repair-shop/service/components/form-dialog'
//
import type Service from '@/features/repair-shop/service/types/service'

let getRowDataRef: {
    current?: GetRowDataType<Service>
}

export default function Page() {
    const mutateRef = useRef<MutateType<Service>>()
    const _getRowDataRef = useRef<GetRowDataType<Service>>()
    const [formData, setFormData] = useState<Partial<Service>>()

    return (
        <AuthLayout title="Data Layanan">
            <Fab in={!formData} onClick={() => setFormData({})} />

            <ServiceFormDialog
                formData={formData}
                handleClose={() => {
                    setFormData(undefined)
                    mutateRef.current?.()
                }}
            />

            <Datatable<Service>
                apiUrl="repair-shop/services/datatable"
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
                setRowProps={() => ({
                    style: {
                        color: 'white !important',
                    },
                })}
                title="Daftar Layanan"
                tableId="services-datatable"
            />
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: DatatableProps<Service>['columns'] = [
    {
        name: 'id',
        label: 'ID',
        options: {
            customBodyRender: (value: string, dataIndex) => {
                const deleted_at =
                    getRowDataRef.current?.(dataIndex)?.deleted_at

                return deleted_at ? (
                    <Tooltip title="Data telah dihapus" arrow placement="top">
                        <span>
                            {value}
                            <DeleteIcon
                                color="error"
                                sx={{
                                    fontSize: '1.5em',
                                }}
                            />
                        </span>
                    </Tooltip>
                ) : (
                    value
                )
            },
        },
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'default_price',
        label: 'Harga (Rp)',
        options: {
            customBodyRender: value => formatNumber(value),
        },
    },
]
