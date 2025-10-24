'use client'

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// materials
import Chip from '@mui/material/Chip'
import type { FormikConfig } from 'formik'
// vendors
import { Formik } from 'formik'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
// components
import { type MutateType } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import FlexColumnBox from '@/components/FlexColumnBox'
import PageTitle from '@/components/page-title'
// page components
import LoansDatatable from '@/components/pages/user-loans/Datatable'
import LoanForm, { INITIAL_VALUES } from '@/components/pages/user-loans/Form'
import type { UserLoanFormDataType } from '@/components/pages/user-loans/Form/types'
import ScrollableXBox from '@/components/ScrollableXBox'
import UserLoan from '@/enums/permissions/UserLoan'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
// types
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
// utils
import errorCatcher from '@/utils/handle-422'

let mutateUserLoans: MutateType<UserLoanORM>

export default function UserLoans() {
    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const isAuthHasPermission = useIsAuthHasPermission()
    const [values, setValues] = useState(INITIAL_VALUES)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [userLoanFromDb, setUserLoanFromDb] = useState<UserLoanORM | null>(
        null,
    )

    const handleNew = useCallback(() => {
        setValues(INITIAL_VALUES)
        setUserLoanFromDb(null)
        setDialogOpen(true)
    }, [])

    const handleEdit = useCallback((values: UserLoanORM) => {
        setValues({
            cashable_uuid: values.transaction?.cashable_uuid ?? '',
            interest_percent: values.interest_percent,
            n_term: values.n_term,
            proposed_at: values.proposed_at,
            proposed_rp: values.proposed_rp,
            purpose: values.purpose,
            term_unit: values.term_unit,
            type: values.type,
            user_uuid: values.user_uuid,
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
        : (userLoanFromDb.responses?.length ?? 0) > 0
          ? 'Rincian Pinjaman'
          : 'Perbarui Pinjaman'

    return (
        <>
            <PageTitle title="Kelola Pinjaman" />
            <FlexColumnBox>
                <FilterChips />

                <LoansDatatable
                    apiUrlParams={{ type: query.type as string | undefined }}
                    mode="manager"
                    mutateCallback={fn => (mutateUserLoans = fn)}
                    onEdit={handleEdit}
                />
            </FlexColumnBox>

            <DialogWithTitle open={dialogOpen} title={title}>
                <Formik
                    component={LoanForm}
                    initialStatus={{
                        mode: 'manager',
                        userLoanFromDb: userLoanFromDb,
                    }}
                    initialValues={values}
                    onReset={closeDialog}
                    onSubmit={handleSubmit}
                />
            </DialogWithTitle>

            <Fab
                aria-label="Ajukan pinjaman baru"
                in={isAuthHasPermission(UserLoan.CREATE)}
                onClick={handleNew}>
                <PaymentsIcon />
            </Fab>
        </>
    )
}

const CHIP_DEFAULT_PROPS = {
    component: Link,
    size: 'small',
} as const

function FilterChips() {
    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={Boolean(query.type)}
                color={query.type ? undefined : 'success'}
                href="?type="
                label="Semua"
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={query.type === 'active'}
                color={query.type === 'active' ? 'success' : undefined}
                href="?type=active"
                label="Angsuran Aktif"
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={query.type === 'waiting'}
                color={query.type === 'waiting' ? 'success' : undefined}
                href="?type=waiting"
                label="Belum Dicairkan"
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                clickable={query.type === 'finished'}
                color={query.type === 'finished' ? 'success' : undefined}
                href="?type=finished"
                label="Selesai"
            />
        </ScrollableXBox>
    )
}
