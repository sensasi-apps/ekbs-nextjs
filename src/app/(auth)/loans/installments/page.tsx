'use client'

// vendors
import { Formik } from 'formik'
import { useState } from 'react'
import { mutate } from '@/components/Datatable'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import PageTitle from '@/components/page-title'
// local components
import UserLoanInstallmentDatatable from '@/components/pages/user-loans/installments/Datatable'
import UserLoanInstallmentForm, {
    UserLoanInstallmentFormInitialValues,
} from '@/components/pages/user-loans/installments/Form'
import axios from '@/lib/axios'
// types
import type InstallmentORM from '@/modules/installment/types/orms/installment'
// utils
import errorCatcher from '@/utils/handle-422'

export default function UserLoansInstallmentsPage() {
    const [formData, setFormData] = useState(
        UserLoanInstallmentFormInitialValues,
    )
    const [userLoanInstallment, setUserLoanInstallment] =
        useState<InstallmentORM | null>(null)
    const [isOpenDialog, setIsOpenDialog] = useState(false)

    const handleClose = () => setIsOpenDialog(false)

    const handleEdit = (data: InstallmentORM) => {
        setFormData({
            cashable_cash_uuid: data?.transaction?.cashable_uuid ?? '',
        })
        setUserLoanInstallment(data)
        setIsOpenDialog(true)
    }

    return (
        <>
            <PageTitle title="Pembayaran Angsuran" />

            <UserLoanInstallmentDatatable onEdit={handleEdit} />

            <DialogWithTitle open={isOpenDialog} title="Pembayaran Angsuran">
                <Formik
                    component={UserLoanInstallmentForm}
                    initialStatus={{
                        userLoanInstallment: userLoanInstallment,
                    }}
                    initialValues={formData}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `user-loans/${userLoanInstallment?.uuid}/installments/collect`,
                                values,
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                />
            </DialogWithTitle>
        </>
    )
}
