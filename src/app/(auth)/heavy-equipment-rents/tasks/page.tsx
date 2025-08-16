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
// components
import DialogWithTitle from '@/components/DialogWithTitle'
// page components
import HeavyEquipmentRentFinishTaskForm, {
    type HerFinishTaskFormValues,
} from '@/app/(auth)/heavy-equipment-rents/_parts/form/finish-task'
// utils
import errorCatcher from '@/utils/handle-422'
import HeavyEquipmentRentsDatatable from '@/app/(auth)/heavy-equipment-rents/_parts/her-datatable'
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'
import PageTitle from '@/components/page-title'

let mutate: MutateType<RentItemRent>
let getRowData: GetRowDataType<RentItemRent>

export default function HeavyEquipmentRentsTasks() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const [initialFormikValues, setInitialFormikValues] =
        useState<HerFinishTaskFormValues>({})

    const handleRowClick: OnRowClickType = (_, { dataIndex }, event) => {
        if (event.detail === 2) {
            const rentItemRent = getRowData(dataIndex)
            if (!rentItemRent) return

            handleEdit(rentItemRent)
        }
    }

    const handleEdit = (data: RentItemRent) => {
        const formedData: HerFinishTaskFormValues = {
            ...data,
            start_hm:
                data.rate_unit === 'H.M'
                    ? (data.heavy_equipment_rent?.start_hm ?? undefined)
                    : 0,
            end_hm:
                data.rate_unit === 'H.M'
                    ? (data.heavy_equipment_rent?.end_hm ?? undefined)
                    : 1,
        }

        setInitialFormikValues(formedData)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const isNew = !initialFormikValues.uuid

    return (
        <>
            <PageTitle title="Tugas Alat Berat" />

            <HeavyEquipmentRentsDatatable
                handleRowClick={handleRowClick}
                mutateCallback={fn => (mutate = fn)}
                getRowDataCallback={fn => (getRowData = fn)}
                as="operator"
            />

            <DialogWithTitle
                title={`${isNew ? 'Tambah' : 'Perbaharui'} Data Penyewaan`}
                open={isDialogOpen}>
                <Formik
                    enableReinitialize
                    initialValues={initialFormikValues}
                    onSubmit={(values, { setErrors }) => {
                        const formData = {
                            finished_at: values.finished_at ?? null,
                            start_hm: values.start_hm ?? 0,
                            end_hm: values.end_hm ?? 0,
                        }

                        return axios
                            .post(
                                ApiUrlEnum.FINISH_TASK.replace(
                                    '$1',
                                    values.uuid as string,
                                ),
                                formData,
                            )
                            .then(() => {
                                if (mutate) {
                                    mutate()
                                }

                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }}
                    onReset={handleClose}
                    component={HeavyEquipmentRentFinishTaskForm}
                />
            </DialogWithTitle>
        </>
    )
}
