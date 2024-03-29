// types
import type { FormikConfig } from 'formik'
import type UserLoanType from '@/dataTypes/Loan'
// vendors
import { useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// components
import { mutate } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import UserLoanDisburseForm, {
    FormValuesType,
} from '@/components/pages/user-loans/disburse/Form'
import UserLoanDisburseDatatable from '@/components/pages/user-loans/disburse/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
// utils
import useDisablePage from '@/hooks/useDisablePage'
import errorCatcher from '@/utils/errorCatcher'
// enums
import ApiUrlEnum from '@/components/pages/user-loans/ApiUrlEnum'

export default function UserLoansDisburses() {
    useDisablePage()

    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [formData, setFormData] = useState<FormValuesType>({})
    const [userLoan, setUserLoan] = useState<UserLoanType | null>(null)

    const handleEdit = (userLoan: UserLoanType) => {
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
        <AuthLayout title="Pencairan Pinjaman">
            <UserLoanDisburseDatatable onEdit={handleEdit} />

            <DialogWithTitle title="Pencairan Pinjaman" open={isDialogOpen}>
                <Formik
                    initialValues={formData}
                    initialStatus={{
                        userLoan: userLoan,
                    }}
                    onSubmit={handleSubmit}
                    onReset={handleClose}
                    component={UserLoanDisburseForm}
                />
            </DialogWithTitle>
        </AuthLayout>
    )
}
