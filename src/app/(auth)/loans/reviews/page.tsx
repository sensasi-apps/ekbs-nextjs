'use client'

// types
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// vendors
import { useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// components
import { mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import PageTitle from '@/components/page-title'
// page parts
import LoanReviewForm, {
    type FormDataType,
} from '@/app/(auth)/loans/reviews/form'
import ReviewDatatable from '@/app/(auth)/loans/reviews/datatable'
// utils
import errorCatcher from '@/utils/handle-422'
// hooks
import useDisablePage from '@/hooks/useDisablePage'

export default function UserLoansReviews() {
    useDisablePage()

    const [state, setState] = useState<FormOpenStateType | FormCloseStateType>(
        CLOSE_STATE,
    )

    const handleClose = () => setState(CLOSE_STATE)

    return (
        <>
            <PageTitle title="Persetujuan Pinjaman" />

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
        </>
    )
}

export type FormOpenStateType = {
    isDialogOpen: true
    formData: FormDataType
    userLoan: UserLoanORM
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
