'use client'

// icons
import EventNoteIcon from '@mui/icons-material/EventNote'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// enums
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'
// page components
import HeavyEquipmentRentForm, {
    type HeavyEquipmentRentFormValues,
} from '@/app/(auth)/heavy-equipment-rents/_parts/form'
import HeavyEquipmentRentsDatatable from '@/app/(auth)/heavy-equipment-rents/_parts/her-datatable'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// components
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import PageTitle from '@/components/page-title'
import HerPermission from '@/enums/permissions/heavy-equipment-rent'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
// types
import type RentItemRent from '@/types/orms/rent-item-rent'
// utils
import errorCatcher from '@/utils/handle-422'

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
            cashable_uuid: data.transaction?.cashable_uuid,
            farmer_group_uuid: data.farmer_group?.uuid,
            interest_percent: data.installment?.interest_percent,
            is_validated_by_admin: Boolean(data.validated_by_admin_at),
            n_term: data.installment?.n_term,
            operated_by_user: data.heavy_equipment_rent?.operated_by_user,
            operated_by_user_uuid:
                data.heavy_equipment_rent?.operated_by_user_uuid,
            term_unit: data.installment?.term_unit,
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
                as="admin"
                getRowDataCallback={fn => (getRowData = fn)}
                handleRowClick={handleRowClick}
                mutateCallback={fn => (mutate = fn)}
            />

            <DialogWithTitle
                open={isDialogOpen}
                title={`${isNew ? 'Tambah' : 'Perbaharui'} Data Penyewaan`}>
                <Formik
                    enableReinitialize
                    initialValues={initialFormikValues}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) => {
                        const formData = {
                            by_user_uuid: values.by_user_uuid,

                            // if payment_method is cash
                            cashable_uuid: values.cashable_uuid,
                            farmer_group_uuid: values.farmer_group_uuid,
                            for_at: values.for_at,
                            for_n_units: values.for_n_units,
                            interest_percent: values.interest_percent,
                            inventory_item_uuid: values.inventory_item_uuid,
                            is_validated_by_admin: values.is_validated_by_admin,

                            // if payment_method is installment
                            n_term: values.n_term,
                            note: values.note,
                            operated_by_user_uuid: values.operated_by_user_uuid,
                            payment_method: values.payment_method,
                            rate_rp_per_unit: values.rate_rp_per_unit,
                            rate_unit: values.rate_unit,
                            term_unit: values.term_unit,
                            type: values.type,
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
                    }}>
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
