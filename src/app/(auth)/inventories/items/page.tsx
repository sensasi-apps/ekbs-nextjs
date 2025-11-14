'use client'

import ReceiptIcon from '@mui/icons-material/Receipt'
// icons
import WarningIcon from '@mui/icons-material/Warning'
// materials
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/navigation'
// vendors
import { useState } from 'react'
// types
import type { InventoryItemFormValues } from '@/app/(auth)/inventories/items/[uuid]/_parts/form'
// page components
import InventoryItemFormWithFormik from '@/app/(auth)/inventories/items/[uuid]/_parts/form/with-formik'
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// components
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import PageTitle from '@/components/page-title'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import type InventoryItem from '@/types/orms/inventory-item'
// utils
import toDmy from '@/utils/to-dmy'

let mutate: MutateType<InventoryItem>
let getRowData: GetRowDataType<InventoryItem>

export default function InventoryItems() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const { push } = useRouter()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState<InventoryItemFormValues>({})

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const inventoryItem = getRowData(dataIndex)
            if (!inventoryItem) return

            push(`/inventories/items/${inventoryItem.uuid}`)
        }
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikValues.uuid

    return (
        <>
            <PageTitle title="Inventaris" />

            <Datatable
                apiUrl="/inventory-items/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'owned_at' }}
                getRowDataCallback={fn => (getRowData = fn)}
                mutateCallback={fn => (mutate = fn)}
                onRowClick={handleRowClick}
                tableId="inventory-item-table"
                title="Daftar"
            />

            {isAuthHasPermission('create inventory item') && (
                <DialogWithTitle
                    open={isDialogOpen}
                    title={`${isNew ? 'Tambah' : 'Perbaharui'} Inventaris`}>
                    <InventoryItemFormWithFormik
                        initialValues={initialFormikValues}
                        onReset={handleClose}
                        onSubmitted={() => {
                            mutate()
                            handleClose()
                        }}
                    />
                </DialogWithTitle>
            )}

            <Fab
                in={isAuthHasPermission('create inventory item') ?? false}
                onClick={handleNew}>
                <ReceiptIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<InventoryItem>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: false,
        },
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        label: 'Dimiliki pada',
        name: 'owned_at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Penanda',
        name: 'tags.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const tags = getRowData(dataIndex)?.tags ?? []

                return tags.map(({ name: { id } }) => id).join(', ')
            },
            sort: false,
        },
    },
    {
        label: 'Deskripsi',
        name: 'desc',
        options: {
            display: false,
        },
    },
    {
        label: 'Fungsionalitas',
        name: 'unfunctional_note',
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
        label: 'Penanggung Jawab',
        name: 'latestPic.picUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } =
                    getRowData(dataIndex)?.latest_pic?.pic_user ?? {}

                return id ? `#${id} ${name}` : '-'
            },
        },
    },
    {
        label: 'Pemeriksaan Terakhir',
        name: 'latestCheckup.note',
        options: {
            customBodyRenderLite: dataIndex => {
                const checkup = getRowData(dataIndex)?.latest_checkup
                if (!checkup) return ''

                return (
                    <>
                        {checkup.note}
                        <br />
                        <Typography color="textSecondary" variant="caption">
                            {toDmy(checkup.at)} oleh #{checkup.by_user.id}{' '}
                            {checkup.by_user.name}
                        </Typography>
                    </>
                )
            },
        },
    },
]
