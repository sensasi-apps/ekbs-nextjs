// types
import type LoanType from '@/dataTypes/Loan'
import type { FormDataType } from '@/components/pages/user-loans/reviews/Form'
// vendors
import { useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// components
import { mutate } from '@/components/Global/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import LoanReviewForm from '@/components/pages/user-loans/reviews/Form'
import ReviewDatatable from '@/components/pages/user-loans/reviews/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
// utils
import errorCatcher from '@/utils/errorCatcher'

export default function UserLoansReviews() {
    const [state, setState] = useState<FormOpenStateType | FormCloseStateType>(
        CLOSE_STATE,
    )

    const handleClose = () => setState(CLOSE_STATE)

    return (
        <AuthLayout title="Persetujuan Pinjaman">
            <ReviewDatatable onSetReviewState={setState} />

            <DialogWithTitle
                title="Persetujuan Pinjaman"
                open={state.isDialogOpen}>
                <Formik
                    initialValues={state.formData}
                    initialStatus={{
                        userLoan: state.userLoan,
                    }}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `user-loans/${values.user_loan_uuid}/review`,
                                values,
                            )
                            .then(() => {
                                mutate()
                                handleClose()
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                    onReset={handleClose}
                    component={LoanReviewForm}
                />
            </DialogWithTitle>
        </AuthLayout>
    )
}

export type FormOpenStateType = {
    isDialogOpen: true
    formData: FormDataType
    userLoan: LoanType
}

type FormCloseStateType = {
    isDialogOpen: false
    formData: never
    userLoan: never
}

const CLOSE_STATE: FormCloseStateType = {
    isDialogOpen: false,
    formData: {} as never,
    userLoan: {} as never,
}
