// types
import type { ElementType } from 'react'
import type CashType from '@/dataTypes/Cash'
// vendors
import axios from '@/lib/axios'
import { Formik, useFormikContext } from 'formik'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// components
import CashForm, { initialValues } from '@/components/Cash/Form'
import CashList, { mutate } from '@/components/Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import useAuth from '@/providers/Auth'

function Main() {
    const { status, values } = useFormikContext<CashType>()

    return (
        <>
            <CashList />

            <Dialog
                open={status.dialogOpen}
                fullWidth
                maxWidth="xs"
                keepMounted>
                <DialogTitle>
                    {values.uuid
                        ? `Ubah data Kas${
                              values.code ? ': ' + values.code : ''
                          }`
                        : 'Tambah Kas baru'}
                </DialogTitle>
                <DialogContent>
                    <CashForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default function CashCrud(props: {
    wrapper: ElementType
    [key: string]: any // this is should equal to props of wrapper component (eg: Grid), not like this
}) {
    const { userHasPermission } = useAuth()
    if (userHasPermission('cashes read') === false) return null

    const { wrapper: Wrapper = 'div', ...rest } = props

    return (
        <Wrapper {...rest}>
            <Formik
                initialValues={initialValues}
                initialStatus={{
                    dialogOpen: false,
                }}
                onSubmit={(values, { setStatus, setErrors, resetForm }) =>
                    axios
                        .post('cashes', values)
                        .then(() => {
                            mutate()
                            setStatus({ dialogOpen: false })
                            resetForm()
                        })
                        .catch(error => errorCatcher(error, setErrors))
                }
                onReset={(_, { setStatus }) =>
                    setStatus({
                        dialogOpen: false,
                    })
                }>
                <Main />
            </Formik>
        </Wrapper>
    )
}
