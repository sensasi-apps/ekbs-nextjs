'use client'

// types
import type UserLoanORM from '@/modules/installment/types/orms/user-loan'
import type { FormikConfig } from 'formik'
import type { UserLoanFormDataType } from '@/components/pages/user-loans/Form/types'
// vendors
import { Formik } from 'formik'
import { useCallback, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from '@/lib/axios'
import Link from 'next/link'
// materials
import Chip from '@mui/material/Chip'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import { type MutateType } from '@/components/Datatable'
import Fab from '@/components/Fab'
import DialogWithTitle from '@/components/DialogWithTitle'
import PageTitle from '@/components/page-title'
import ScrollableXBox from '@/components/ScrollableXBox'
// page components
import LoansDatatable from '@/components/pages/user-loans/Datatable'
import LoanForm, { INITIAL_VALUES } from '@/components/pages/user-loans/Form'
// utils
import errorCatcher from '@/utils/handle-422'
import UserLoan from '@/enums/permissions/UserLoan'
import FlexColumnBox from '@/components/FlexColumnBox'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

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
        : (userLoanFromDb.responses?.length ?? 0) > 0
          ? 'Rincian Pinjaman'
          : 'Perbarui Pinjaman'

    return (
        <>
            <PageTitle title="Kelola Pinjaman" />
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
        </>
    )
}

const CHIP_DEFAULT_PROPS = {
    size: 'small',
    component: Link,
} as const

function FilterChips() {
    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    return (
        <ScrollableXBox>
            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Semua"
                href="?type="
                clickable={Boolean(query.type)}
                color={query.type ? undefined : 'success'}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Angsuran Aktif"
                href="?type=active"
                clickable={query.type === 'active'}
                color={query.type === 'active' ? 'success' : undefined}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Belum Dicairkan"
                href="?type=waiting"
                clickable={query.type === 'waiting'}
                color={query.type === 'waiting' ? 'success' : undefined}
            />

            <Chip
                {...CHIP_DEFAULT_PROPS}
                label="Selesai"
                href="?type=finished"
                clickable={query.type === 'finished'}
                color={query.type === 'finished' ? 'success' : undefined}
            />
        </ScrollableXBox>
    )
}
