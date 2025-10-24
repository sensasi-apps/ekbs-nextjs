'use client'

// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import ApiUrlEnum from '@/app/(auth)/heavy-equipment-rents/_parts/api-url-enum'
// page components
import HeavyEquipmentRentFinishTaskForm, {
    type HerFinishTaskFormValues,
} from '@/app/(auth)/heavy-equipment-rents/_parts/form/finish-task'
import HeavyEquipmentRentsDatatable from '@/app/(auth)/heavy-equipment-rents/_parts/her-datatable'
import type {
    GetRowDataType,
    MutateType,
    OnRowClickType,
} from '@/components/Datatable'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import PageTitle from '@/components/page-title'
import axios from '@/lib/axios'
// types
import type RentItemRent from '@/types/orms/rent-item-rent'
// utils
import errorCatcher from '@/utils/handle-422'

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
            end_hm:
                data.rate_unit === 'H.M'
                    ? (data.heavy_equipment_rent?.end_hm ?? undefined)
                    : 1,
            start_hm:
                data.rate_unit === 'H.M'
                    ? (data.heavy_equipment_rent?.start_hm ?? undefined)
                    : 0,
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
                as="operator"
                getRowDataCallback={fn => {
                    getRowData = fn
                }}
                handleRowClick={handleRowClick}
                mutateCallback={fn => {
                    mutate = fn
                }}
            />

            <DialogWithTitle
                open={isDialogOpen}
                title={`${isNew ? 'Tambah' : 'Perbaharui'} Data Penyewaan`}>
                <Formik
                    component={HeavyEquipmentRentFinishTaskForm}
                    enableReinitialize
                    initialValues={initialFormikValues}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) => {
                        const formData = {
                            end_hm: values.end_hm ?? 0,
                            finished_at: values.finished_at ?? null,
                            start_hm: values.start_hm ?? 0,
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
                />
            </DialogWithTitle>
        </>
    )
}
