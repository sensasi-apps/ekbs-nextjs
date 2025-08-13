// types
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { useCallback, useState } from 'react'
import { Formik, type FormikConfig } from 'formik'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
// local components
import CashForm, { INITIAL_VALUES } from './Form'
import CashList, { mutate } from './List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import Cash from '@/enums/permissions/Cash'

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
            <CashList onNew={handleNew} onEdit={handleEdit} />

            <DialogWithTitle
                title={
                    values.uuid
                        ? `Ubah data Kas: ${values.code ?? values.name}`
                        : 'Tambah Kas baru'
                }
                open={dialogOpen}>
                <Formik
                    initialValues={values}
                    onSubmit={handleSubmit}
                    onReset={closeDialog}
                    component={CashForm}
                />
            </DialogWithTitle>
        </>
    )
}
