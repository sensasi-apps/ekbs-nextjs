// types
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { useCallback, useState } from 'react'
import { Formik, FormikConfig } from 'formik'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// components
import CashForm, { INITIAL_VALUES } from '@/components/Cash/Form'
import CashList, { mutate } from '@/components/Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import useAuth from '@/providers/Auth'

export default function CashCrud() {
    const { userHasPermission } = useAuth()
    const [values, setValues] = useState<CashType>(INITIAL_VALUES)
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

    const handleSubmit: FormikConfig<CashType>['onSubmit'] = useCallback(
        (values, { setErrors }) =>
            axios
                .post('cashes', values)
                .then(() => {
                    mutate()
                    closeDialog()
                })
                .catch(error => errorCatcher(error, setErrors)),
        [],
    )

    if (userHasPermission('cashes read') === false) return null

    return (
        <>
            <CashList onNew={handleNew} onEdit={handleEdit} />

            <Dialog open={dialogOpen} fullWidth maxWidth="xs">
                <DialogTitle>
                    {values.uuid
                        ? `Ubah data Kas: ${values.code ?? values.name}`
                        : 'Tambah Kas baru'}
                </DialogTitle>
                <DialogContent>
                    <Formik
                        initialValues={values}
                        onSubmit={handleSubmit}
                        onReset={closeDialog}
                        component={CashForm}
                    />
                </DialogContent>
            </Dialog>
        </>
    )
}
