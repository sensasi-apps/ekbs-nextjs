// types
import type RentItemRent from '@/dataTypes/RentItemRent'
import type { MUIDataTableColumn } from 'mui-datatables'
import type { OnRowClickType } from '@/components/Datatable'
import type { KeyedMutator } from 'swr'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
// import IconButton from '@mui/material/IconButton'
// import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import EventNoteIcon from '@mui/icons-material/EventNote'
// import PrintIcon from '@mui/icons-material/Print'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import WhatsAppButton from '@/components/WhatsappButton'
// page components
import HeavyEquipmentRentForm, {
    HeavyEquipmentRentFormValues,
} from '@/components/pages/heavy-equipments-rents/Form'
import HerMonthlyCalender from '@/components/pages/heavy-equipments-rents/Calendar'
// providers
import useAuth from '@/providers/Auth'
// utils
import toDmy from '@/utils/toDmy'
import errorCatcher from '@/utils/errorCatcher'

let mutate: KeyedMutator<RentItemRent[]>
let mutateCalendar: KeyedMutator<RentItemRent[]>
let getDataRow: (dataIndex: number) => RentItemRent | undefined

export default function FarmInputProductSales() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'unfinished' | 'all'>('all')

    const [initialFormikValues, setInitialFormikValues] =
        useState<HeavyEquipmentRentFormValues>({})

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const rentItemRent = getDataRow(dataIndex)
            if (!rentItemRent) return

            handleEdit(rentItemRent)
        }
    }

    const handleEdit = (data: RentItemRent) => {
        const formedData: HeavyEquipmentRentFormValues = {
            ...data,
            operated_by_user: data.heavy_equipment_rent?.operated_by_user,
            operated_by_user_uuid:
                data.heavy_equipment_rent?.operated_by_user_uuid,
            farmer_group_uuid: data.farmer_group?.uuid,
        }

        setInitialFormikValues(formedData)
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikValues.uuid

    return (
        <AuthLayout title="Penyewaan Alat Berat">
            <Box display="flex" gap={1} mb={4}>
                <Chip
                    color={activeTab === 'all' ? 'success' : undefined}
                    label="Semua"
                    onClick={
                        activeTab === 'all'
                            ? undefined
                            : () => setActiveTab('all')
                    }
                />

                <Chip
                    color={activeTab === 'unfinished' ? 'success' : undefined}
                    label="Belum Selesai"
                    onClick={
                        activeTab === 'unfinished'
                            ? undefined
                            : () => setActiveTab('unfinished')
                    }
                />
            </Box>

            <Fade in={activeTab === 'all'} unmountOnExit>
                <div>
                    <HerMonthlyCalender
                        mutateCallback={mutator => (mutateCalendar = mutator)}
                        onEventClick={handleEdit}
                    />
                </div>
            </Fade>

            <Fade in={activeTab === 'unfinished'} unmountOnExit>
                <div>
                    <Datatable
                        title="Daftar"
                        tableId="unfinished-heavy-equipment-rents-datatable"
                        apiUrl="/heavy-equipment-rents/datatable/unfinished"
                        onRowClick={handleRowClick}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{
                            name: 'for_at',
                            direction: 'asc',
                        }}
                        mutateCallback={mutator => (mutate = mutator)}
                        getDataByRowCallback={getDataRowFn =>
                            (getDataRow = getDataRowFn)
                        }
                    />
                </div>
            </Fade>

            {userHasPermission([
                'create heavy equipment rent',
                'update heavy equipment rent',
            ]) && (
                <DialogWithTitle
                    title={`${isNew ? 'Tambah' : 'Perbaharui'} Data Penyewaan`}
                    open={isDialogOpen}>
                    <Formik
                        enableReinitialize
                        initialValues={initialFormikValues}
                        onSubmit={(values, { setErrors }) => {
                            const formData = {
                                ...values,
                                uuid: undefined,
                                by_user: undefined,
                                operated_by_user: undefined,
                                inventory_item: undefined,
                                farmer_group: undefined,
                                transaction: undefined,
                                installments: undefined,
                                heavy_equipment_rent: undefined,
                            }

                            return axios
                                .post(
                                    `heavy-equipment-rents${
                                        values.uuid ? '/' + values.uuid : ''
                                    }`,
                                    formData,
                                )
                                .then(() => {
                                    if (mutate) {
                                        mutate()
                                    }

                                    mutateCalendar()
                                    handleClose()
                                })
                                .catch(error => errorCatcher(error, setErrors))
                        }}
                        onReset={handleClose}
                        component={HeavyEquipmentRentForm}
                    />
                </DialogWithTitle>
            )}

            <Fab
                in={userHasPermission('create heavy equipment rent') ?? false}
                onClick={handleNew}>
                <EventNoteIcon />
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
        name: 'for_at',
        label: 'Untuk Tanggal',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'by_user.name',
        label: 'Penyewa/PJ',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } = getDataRow(dataIndex)?.by_user ?? {}

                return id ? `#${id} ${name}` : '-'
            },
        },
    },
    {
        name: 'farmer_group.name',
        label: 'KelompoK Tani',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name } = getDataRow(dataIndex)?.farmer_group ?? {}

                return name ? name : '-'
            },
        },
    },
    {
        name: 'inventory_item.code',
        label: 'Kode Alat Berat',
        options: {
            display: 'excluded',
        },
    },
    {
        name: 'inventory_item.name',
        label: 'Unit Alat Berat',
        options: {
            customBodyRenderLite: dataIndex => {
                const { name, code } =
                    getDataRow(dataIndex)?.inventory_item ?? {}

                return (
                    <>
                        {code && (
                            <Typography
                                variant="caption"
                                color="textSecondary"
                                mr={1}>
                                {code}
                            </Typography>
                        )}

                        {name}
                    </>
                )
            },
        },
    },
    {
        name: 'heavy_equipment_rent.operated_by_user.name',
        label: 'Operator',
        options: {
            customBodyRenderLite: dataIndex => {
                const { id, name } =
                    getDataRow(dataIndex)?.heavy_equipment_rent
                        ?.operated_by_user ?? {}

                return id ? `#${id} ${name}` : '-'
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
    {
        name: 'uuid',
        label: 'Kirim Tugas',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: uuid => (
                <WhatsAppButton
                    endpoint={`/heavy-equipment-rents/${uuid}/notify-operator`}
                    title="Notifikasi Operator"
                />
            ),
        },
    },
    // {
    //     name: 'uuid',
    //     label: 'Cetak',
    //     options: {
    //         searchable: false,
    //         sort: false,
    //         customBodyRenderLite: uuid => (
    //             <Tooltip title="Cetak" placement="top">
    //                 <span>
    //                     <IconButton size="small">
    //                         <PrintIcon />
    //                     </IconButton>
    //                 </span>
    //             </Tooltip>
    //         ),
    //     },
    // },
]
