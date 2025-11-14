'use client'

import { Formik } from 'formik'
// vendors
import { useState } from 'react'
import ReviewDatatable from '@/app/(auth)/loans/reviews/datatable'
// page parts
import LoanReviewForm, {
    type FormDataType,
} from '@/app/(auth)/loans/reviews/form'
// components
import { mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/dialog-with-title'
import PageTitle from '@/components/page-title'
// hooks
import useDisablePage from '@/hooks/useDisablePage'
import axios from '@/lib/axios'
// types
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// utils
import errorCatcher from '@/utils/handle-422'

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
                open={state.isDialogOpen}
                title="Persetujuan Pinjaman">
                <Formik
                    component={LoanReviewForm}
                    initialStatus={{
                        userLoan: state.userLoan,
                    }}
                    initialValues={state.formData}
                    onReset={handleClose}
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
    formData: {} as never,
    isDialogOpen: false,
    userLoan: {} as never,
}
