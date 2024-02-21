// types
import type RentItemRent from '@/dataTypes/RentItemRent'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
import type { KeyedMutator } from 'swr'
import type YajraDatatable from '@/types/responses/YajraDatatable'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
// icons
import EventNoteIcon from '@mui/icons-material/EventNote'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// page components
import HeavyEquipmentRentForm, {
    HeavyEquipmentRentFormValues,
} from '@/components/pages/heavy-equipments-rents/Form'
import HerMonthlyCalender from '@/components/pages/heavy-equipments-rents/Calendar'
import HeavyEquipmentRentsDatatable from '@/components/pages/heavy-equipments-rents/Datatable'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'
// enums
import ApiUrlEnum from '@/components/pages/heavy-equipments-rents/ApiUrlEnum'

let mutate: MutateType<RentItemRent>
let mutateCalendar: KeyedMutator<YajraDatatable<RentItemRent>>
let getRowData: GetRowDataType<RentItemRent>

export default function HeavyEquipmentRent() {
    const { userHasPermission } = useAuth()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'unfinished' | 'calendar' | ''>(
        'calendar',
    )

    const [initialFormikValues, setInitialFormikValues] =
        useState<HeavyEquipmentRentFormValues>({})

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const rentItemRent = getRowData(dataIndex)
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
            n_term: data.installment?.n_term,
            term_unit: data.installment?.term_unit,
            interest_percent: data.installment?.interest_percent,
            is_validated_by_admin: Boolean(data.validated_by_admin_at),
            cashable_uuid: data.transaction?.cashable_uuid,
        }

        setInitialFormikValues(formedData)
        setIsDialogOpen(true)
    }

    const handleNew = () => {
        setInitialFormikValues({})
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const handleMutate = () => {
        if (mutate) {
            mutate()
        }

        mutateCalendar()
    }

    const isNew = !initialFormikValues.uuid

    return (
        <AuthLayout title="Penyewaan Alat Berat">
            <Box display="flex" gap={1} mb={4}>
                <Chip
                    color={activeTab === 'calendar' ? 'success' : undefined}
                    label="Kalender"
                    onClick={
                        activeTab === 'calendar'
                            ? undefined
                            : () => setActiveTab('calendar')
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

                <Chip
                    color={activeTab === '' ? 'success' : undefined}
                    label="Semua"
                    onClick={
                        activeTab === '' ? undefined : () => setActiveTab('')
                    }
                />
            </Box>

            <Fade in={activeTab === 'calendar'} unmountOnExit>
                <div>
                    <HerMonthlyCalender
                        mutateCallback={mutator => (mutateCalendar = mutator)}
                        onEventClick={handleEdit}
                    />
                </div>
            </Fade>

            <Fade in={activeTab !== 'calendar'} unmountOnExit>
                <div>
                    <HeavyEquipmentRentsDatatable
                        handleRowClick={handleRowClick}
                        mutateCallback={fn => (mutate = fn)}
                        getRowDataCallback={fn => (getRowData = fn)}
                        apiUrlParams={{
                            type: activeTab !== 'calendar' ? activeTab : '',
                        }}
                    />
                </div>
            </Fade>

            <DialogWithTitle
                title={`${isNew ? 'Tambah' : 'Perbaharui'} Data Penyewaan`}
                open={isDialogOpen}>
                <Formik
                    enableReinitialize
                    initialValues={initialFormikValues}
                    onSubmit={(values, { setErrors }) => {
                        const formData = {
                            by_user_uuid: values.by_user_uuid,
                            for_at: values.for_at,
                            for_n_units: values.for_n_units,
                            inventory_item_uuid: values.inventory_item_uuid,
                            is_validated_by_admin: values.is_validated_by_admin,
                            note: values.note,
                            operated_by_user_uuid: values.operated_by_user_uuid,
                            payment_method: values.payment_method,
                            rate_rp_per_unit: values.rate_rp_per_unit,
                            rate_unit: values.rate_unit,
                            type: values.type,
                            farmer_group_uuid: values.farmer_group_uuid,

                            // if payment_method is installment
                            n_term: values.n_term,
                            term_unit: values.term_unit,
                            interest_percent: values.interest_percent,

                            // if payment_method is cash
                            cashable_uuid: values.cashable_uuid,
                        }

                        return axios
                            .post(
                                ApiUrlEnum.CREATE_OR_UPDATE.replace(
                                    '$1',
                                    values.uuid ? '/' + values.uuid : '',
                                ),
                                formData,
                            )
                            .then(() => {
                                handleMutate()
                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }}
                    onReset={handleClose}>
                    {props => (
                        <HeavyEquipmentRentForm
                            {...props}
                            mutate={handleMutate}
                        />
                    )}
                </Formik>
            </DialogWithTitle>

            <Fab
                in={userHasPermission('create heavy equipment rent') ?? false}
                onClick={handleNew}>
                <EventNoteIcon />
            </Fab>
        </AuthLayout>
    )
}
