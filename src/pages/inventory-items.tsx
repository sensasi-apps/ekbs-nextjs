// types
import type { MUIDataTableColumn } from 'mui-datatables'
import type { InventoryItemFormValues } from '@/components/pages/inventory-items/Form'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
import type InventoryItem from '@/dataTypes/InventoryItem'
// vendors
import { useState } from 'react'
import { useRouter } from 'next/navigation'
// materials
import Typography from '@mui/material/Typography'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// page components
import InventoryItemFormWithFormik from '@/components/pages/inventory-items/Form/WithFormik'
// icons
import WarningIcon from '@mui/icons-material/Warning'
import ReceiptIcon from '@mui/icons-material/Receipt'
// providers
import useAuth from '@/providers/Auth'
// utils
import toDmy from '@/utils/toDmy'

let mutate: MutateType<InventoryItem>
let getRowData: GetRowDataType<InventoryItem>

export default function InventoryItems() {
    const { userHasPermission } = useAuth()
    const { push } = useRouter()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState<InventoryItemFormValues>({})

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const inventoryItem = getRowData(dataIndex)
            if (!inventoryItem) return

            push(`/inventory-items/${inventoryItem.uuid}`)
        }
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikValues.uuid

    return (
        <AuthLayout title="Inventaris">
            <Datatable
                title="Daftar"
                tableId="inventory-item-table"
                apiUrl="/inventory-items/datatable"
                onRowClick={handleRowClick}
                // @ts-expect-error fix this later
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'owned_at', direction: 'desc' }}
                mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
            />

            {userHasPermission('create inventory item') && (
                <DialogWithTitle
                    title={`${isNew ? 'Tambah' : 'Perbaharui'} Inventaris`}
                    open={isDialogOpen}>
                    <InventoryItemFormWithFormik
                        initialValues={initialFormikValues}
                        onSubmitted={() => {
                            mutate()
                            handleClose()
                        }}
                        onReset={handleClose}
                    />
                </DialogWithTitle>
            )}

            <Fab
                in={userHasPermission('create inventory item') ?? false}
                onClick={handleNew}>
                <ReceiptIcon />
            </Fab>
        </AuthLayout>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
        },
    },
    {
        name: 'name',
        label: 'Nama',
    },
    {
        name: 'owned_at',
        label: 'Dimiliki pada',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'tags.name',
        label: 'Penanda',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex => {
                const tags = getRowData(dataIndex)?.tags ?? []

                return tags.map(({ name: { id } }) => id).join(', ')
            },
        },
    },
    {
        name: 'desc',
        label: 'Deskripsi',
        options: {
            display: false,
        },
    },
    {
        name: 'unfunctional_note',
        label: 'Fungsionalitas',
        options: {
            customBodyRender: value =>
                value ? (
                    <>
                        <WarningIcon color="warning" /> {value}
                    </>
                ) : (
                    'Baik'
                ),
        },
    },
    {
        name: 'latestPic.picUser.name',
        label: 'Penanggung Jawab',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } =
                    getRowData(dataIndex)?.latest_pic?.pic_user ?? {}

                return id ? `#${id} ${name}` : '-'
            },
        },
    },
    {
        name: 'latestCheckup.note',
        label: 'Pemeriksaan Terakhir',
        options: {
            customBodyRenderLite: dataIndex => {
                const checkup = getRowData(dataIndex)?.latest_checkup
                if (!checkup) return ''

                return (
                    <>
                        {checkup.note}
                        <br />
                        <Typography variant="caption" color="textSecondary">
                            {toDmy(checkup.at)} oleh #{checkup.by_user.id}{' '}
                            {checkup.by_user.name}
                        </Typography>
                    </>
                )
            },
        },
    },
]
