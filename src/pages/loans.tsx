// types
import type { UserLoanType } from '@/dataTypes/Loan'
import type { FormikConfig } from 'formik'
import type { UserLoanFormDataType } from '@/components/pages/user-loans/Form/types'
// vendors
import axios from '@/lib/axios'
import { Formik } from 'formik'
import { useCallback, useState } from 'react'
// icons
// import PaymentsIcon from '@mui/icons-material/Payments'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
// import Fab from '@/components/Fab'
import { mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
// page components
import LoansDatatable from '@/components/pages/user-loans/Datatable'
import LoanForm, { INITIAL_VALUES } from '@/components/pages/user-loans/Form'
// utils
// import useAuth from '@/providers/Auth'
import errorCatcher from '@/utils/errorCatcher'

export default function Loans() {
    // const { userHasPermission } = useAuth()
    const [values, setValues] = useState(INITIAL_VALUES)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [userLoanFromDb, setUserLoanFromDb] = useState<UserLoanType | null>(
        null,
    )

    // const handleNew = useCallback(() => {
    //     setValues(INITIAL_VALUES)
    //     setUserLoanFromDb(null)
    //     setDialogOpen(true)
    // }, [])

    const handleEdit = useCallback((values: UserLoanType) => {
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

    // if (userHasPermission('cashes read') === false) return null

    const title = !userLoanFromDb
        ? 'Ajukan Pinjaman Baru'
        : userLoanFromDb.responses?.length > 0
          ? 'Rincian Pinjaman'
          : 'Perbarui Pinjaman'

    return (
        <AuthLayout title="Pinjaman Anda">
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

            {/* <Fab onClick={handleNew} aria-label="Ajukan pinjaman baru">
                <PaymentsIcon />
            </Fab> */}
        </AuthLayout>
    )
}
