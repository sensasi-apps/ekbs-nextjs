'use client'

// types
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import type { FormikConfig } from 'formik'
import type { UserLoanFormDataType } from '@/components/pages/user-loans/Form/types'
// vendors
import axios from '@/lib/axios'
import { Formik } from 'formik'
import { useCallback, useState } from 'react'
// components
import { mutate } from '@/components/Datatable'
import PageTitle from '@/components/page-title'
import DialogWithTitle from '@/components/DialogWithTitle'
// page components
import LoansDatatable from '@/components/pages/user-loans/Datatable'
import LoanForm, { INITIAL_VALUES } from '@/components/pages/user-loans/Form'
// utils
import errorCatcher from '@/utils/handle-422'

/**
 * This page is used to see users own loans.
 */
export default function LoansPage() {
    const [values, setValues] = useState(INITIAL_VALUES)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [userLoanFromDb, setUserLoanFromDb] = useState<UserLoanORM | null>(
        null,
    )

    const handleEdit = useCallback((values: UserLoanORM) => {
        setValues({
            interest_percent: values.interest_percent,
            n_term: values.n_term,
            proposed_at: values.proposed_at,
            proposed_rp: values.proposed_rp,
            purpose: values.purpose,
            term_unit: values.term_unit,
            user_uuid: values.user_uuid,
            type: values.type,
            cashable_uuid: values.transaction?.cashable_uuid ?? '',
        })
        setUserLoanFromDb(values)
        setDialogOpen(true)
    }, [])

    const closeDialog = useCallback(() => setDialogOpen(false), [])

    const handleSubmit: FormikConfig<UserLoanFormDataType>['onSubmit'] = (
        values,
        { setErrors },
    ) => {
        const isNew = userLoanFromDb === null

        const method = isNew ? 'post' : 'put'
        const urlPrefix = isNew ? '' : `/${userLoanFromDb.uuid}`

        return axios[method]('loans' + urlPrefix, values)
            .then(() => {
                mutate()
                closeDialog()
            })
            .catch(error => errorCatcher(error, setErrors))
    }

    const title = !userLoanFromDb
        ? 'Ajukan Pinjaman Baru'
        : (userLoanFromDb.responses?.length ?? 0) > 0
          ? 'Rincian Pinjaman'
          : 'Perbarui Pinjaman'

    return (
        <>
            <PageTitle title="Pinjaman Anda" />

            <LoansDatatable mode="applier" onEdit={handleEdit} />

            <DialogWithTitle open={dialogOpen} title={title}>
                <Formik
                    initialValues={values}
                    initialStatus={{
                        mode: 'applier',
                        userLoanFromDb: userLoanFromDb,
                    }}
                    onSubmit={handleSubmit}
                    onReset={closeDialog}
                    component={LoanForm}
                />
            </DialogWithTitle>
        </>
    )
}
