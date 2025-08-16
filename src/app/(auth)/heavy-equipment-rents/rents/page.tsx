'use client'

// types
import type RentItemRent from '@/dataTypes/RentItemRent'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import axios from '@/lib/axios'
// icons
import EventNoteIcon from '@mui/icons-material/EventNote'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import PageTitle from '@/components/page-title'
// page components
import HeavyEquipmentRentForm, {
    type HeavyEquipmentRentFormValues,
} from '@/app/(auth)/heavy-equipment-rents/_parts/form'
import HeavyEquipmentRentsDatatable from '@/app/(auth)/heavy-equipment-rents/_parts/her-datatable'
// utils
import errorCatcher from '@/utils/handle-422'
// enums
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'
import HerPermission from '@/enums/permissions/heavy-equipment-rent'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

let mutate: MutateType<RentItemRent>
let getRowData: GetRowDataType<RentItemRent>

export default function HeavyEquipmentRent() {
    const isAuthHasPermission = useIsAuthHasPermission()

    const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    }

    const isNew = !initialFormikValues.uuid

    return (
        <>
            <PageTitle title="Penyewaan Alat Berat" />

            <HeavyEquipmentRentsDatatable
                handleRowClick={handleRowClick}
                mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
                as="admin"
            />

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
                in={isAuthHasPermission(HerPermission.CREATE) ?? false}
                onClick={handleNew}>
                <EventNoteIcon />
            </Fab>
        </>
    )
}
