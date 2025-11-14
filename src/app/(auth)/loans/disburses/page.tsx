'use client'

// types
import type { FormikConfig } from 'formik'
import { Formik } from 'formik'
// vendors
import { useState } from 'react'
// components
import { mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/dialog-with-title'
import PageTitle from '@/components/page-title'
// enums
import ApiUrlEnum from '@/components/pages/user-loans/ApiUrlEnum'
import UserLoanDisburseDatatable from '@/components/pages/user-loans/disburse/Datatable'
import UserLoanDisburseForm, {
    type FormValuesType,
} from '@/components/pages/user-loans/disburse/Form'
// utils
import useDisablePage from '@/hooks/useDisablePage'
import axios from '@/lib/axios'
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import errorCatcher from '@/utils/handle-422'

export default function UserLoansDisbursesPage() {
    useDisablePage()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<FormValuesType>({})
    const [userLoan, setUserLoan] = useState<UserLoanORM | null>(null)

    const handleEdit = (userLoan: UserLoanORM) => {
        setFormData({
            cashable_uuid: userLoan.transaction?.cashable_uuid,
        })

        setUserLoan(userLoan)
        setIsDialogOpen(true)
    }

    const handleClose = () => setIsDialogOpen(false)

    const handleSubmit: FormikConfig<FormValuesType>['onSubmit'] = (
        values,
        { setErrors },
    ) => {
        if (userLoan === null) throw 'userLoan cannot be null on submit'

        return axios
            .post(ApiUrlEnum.DISBURSE.replace('$1', userLoan.uuid), values)
            .then(() => {
                mutate()
                handleClose()
            })
            .catch(error => errorCatcher(error, setErrors))
    }

    return (
        <>
            <PageTitle title="Pencairan Pinjaman" />
            <UserLoanDisburseDatatable onEdit={handleEdit} />

            <DialogWithTitle open={isDialogOpen} title="Pencairan Pinjaman">
                <Formik
                    component={UserLoanDisburseForm}
                    initialStatus={{
                        userLoan: userLoan,
                    }}
                    initialValues={formData}
                    onReset={handleClose}
                    onSubmit={handleSubmit}
                />
            </DialogWithTitle>
        </>
    )
}
