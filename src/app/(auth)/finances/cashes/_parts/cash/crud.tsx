// types

import { Formik, type FormikConfig } from 'formik'
import { useCallback, useState } from 'react'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import Cash from '@/enums/permissions/Cash'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
// vendors
import axios from '@/lib/axios'
import type CashType from '@/types/orms/cash'
// utils
import errorCatcher from '@/utils/handle-422'
// local components
import CashForm, { INITIAL_VALUES } from './form'
import CashList, { mutate } from './list'

export default function CashCrud() {
    const isAuthHasPermission = useIsAuthHasPermission()
    const [values, setValues] = useState<Partial<CashType>>(INITIAL_VALUES)
    const [dialogOpen, setDialogOpen] = useState(false)

    const handleNew = useCallback(() => {
        setValues(INITIAL_VALUES)
        setDialogOpen(true)
    }, [])

    const handleEdit = useCallback((values: CashType) => {
        setValues(values)
        setDialogOpen(true)
    }, [])

    const closeDialog = useCallback(() => setDialogOpen(false), [])

    const handleSubmit: FormikConfig<Partial<CashType>>['onSubmit'] =
        useCallback(
            (values, { setErrors }) =>
                axios
                    .post('cashes', values)
                    .then(() => {
                        mutate()
                        setDialogOpen(false)
                    })
                    .catch(error => errorCatcher(error, setErrors)),
            [],
        )

    if (isAuthHasPermission(Cash.READ) === false) return null

    return (
        <>
            <CashList onEdit={handleEdit} onNew={handleNew} />

            <DialogWithTitle
                open={dialogOpen}
                title={
                    values.uuid
                        ? `Ubah data Kas: ${values.code ?? values.name}`
                        : 'Tambah Kas baru'
                }>
                <Formik
                    component={CashForm}
                    initialValues={values}
                    onReset={closeDialog}
                    onSubmit={handleSubmit}
                />
            </DialogWithTitle>
        </>
    )
}
