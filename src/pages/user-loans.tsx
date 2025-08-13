// types
import type { UserLoanType } from '@/dataTypes/Loan'
import type { FormikConfig } from 'formik'
import type { UserLoanFormDataType } from '@/components/pages/user-loans/Form/types'
// vendors
import { Formik } from 'formik'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// materials
import Chip, { type ChipOwnProps } from '@mui/material/Chip'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import { type MutateType } from '@/components/Datatable'
import AuthLayout from '@/components/Layouts/AuthLayout'
import Fab from '@/components/Fab'
import DialogWithTitle from '@/components/DialogWithTitle'
import ScrollableXBox from '@/components/ScrollableXBox'
// page components
import LoansDatatable from '@/components/pages/user-loans/Datatable'
import LoanForm, { INITIAL_VALUES } from '@/components/pages/user-loans/Form'
// utils
import errorCatcher from '@/utils/errorCatcher'
import UserLoan from '@/enums/permissions/UserLoan'
import FlexColumnBox from '@/components/FlexColumnBox'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

let mutateUserLoans: MutateType<UserLoanType>

export default function UserLoans() {
    const { query } = useRouter()

    const isAuthHasPermission = useIsAuthHasPermission()
    const [values, setValues] = useState(INITIAL_VALUES)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [userLoanFromDb, setUserLoanFromDb] = useState<UserLoanType | null>(
        null,
    )

    const handleNew = useCallback(() => {
        setValues(INITIAL_VALUES)
        setUserLoanFromDb(null)
        setDialogOpen(true)
    }, [])

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

        return axios[method]('user-loans' + urlPrefix, values)
            .then(() => {
                mutateUserLoans()
                closeDialog()
            })
            .catch(error => errorCatcher(error, setErrors))
    }

    const title = !userLoanFromDb
        ? 'Ajukan Pinjaman Baru'
        : userLoanFromDb.responses?.length > 0
          ? 'Rincian Pinjaman'
          : 'Perbarui Pinjaman'

    return (
        <AuthLayout title="Kelola Pinjaman">
            <FlexColumnBox>
                <FilterChips />

                <LoansDatatable
                    mode="manager"
                    onEdit={handleEdit}
                    apiUrlParams={{ type: query.type as string | undefined }}
                    mutateCallback={fn => (mutateUserLoans = fn)}
                />
            </FlexColumnBox>

            <DialogWithTitle open={dialogOpen} title={title}>
                <Formik
                    initialValues={values}
                    initialStatus={{
                        mode: 'manager',
                        userLoanFromDb: userLoanFromDb,
                    }}
                    onSubmit={handleSubmit}
                    onReset={closeDialog}
                    component={LoanForm}
                />
            </DialogWithTitle>

            <Fab
                aria-label="Ajukan pinjaman baru"
                onClick={handleNew}
                in={isAuthHasPermission(UserLoan.CREATE)}>
                <PaymentsIcon />
            </Fab>
        </AuthLayout>
    )
}

const CHIP_DEFAULT_PROPS: ChipOwnProps = {
    size: 'small',
}

function FilterChips() {
    const { replace, query } = useRouter()

    function handleTypeChange(value?: 'active' | 'waiting' | 'finished') {
        replace({
            query: {
                ...query,
                type: value,
            },
        })
    }

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Semua"
                onClick={() => handleTypeChange(undefined)}
                color={query.type ? undefined : 'success'}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Angsuran Aktif"
                onClick={() => handleTypeChange('active')}
                color={query.type === 'active' ? 'success' : undefined}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Belum Dicairkan"
                onClick={() => handleTypeChange('waiting')}
                color={query.type === 'waiting' ? 'success' : undefined}
            />
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Selesai"
                onClick={() => handleTypeChange('finished')}
                color={query.type === 'finished' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
