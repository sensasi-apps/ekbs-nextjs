'use client'

// types
import type InstallmentORM from '@/modules/installment/types/orms/installment'
// vendors
import { Formik } from 'formik'
import { useState } from 'react'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import { mutate } from '@/components/Datatable'
// local components
import UserLoanInstallmentDatatable from '@/components/pages/user-loans/installments/Datatable'
import UserLoanInstallmentForm, {
    UserLoanInstallmentFormInitialValues,
} from '@/components/pages/user-loans/installments/Form'
import axios from '@/lib/axios'
// utils
import errorCatcher from '@/utils/handle-422'
import PageTitle from '@/components/page-title'

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

            <DialogWithTitle title="Pembayaran Angsuran" open={isOpenDialog}>
                <Formik
                    initialValues={formData}
                    initialStatus={{
                        userLoanInstallment: userLoanInstallment,
                    }}
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
                    onReset={handleClose}
                    component={UserLoanInstallmentForm}
                />
            </DialogWithTitle>
        </>
    )
}
