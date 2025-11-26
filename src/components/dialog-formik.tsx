'use client'

import Button from '@mui/material/Button'
import Dialog, { type DialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import LinearProgress from '@mui/material/LinearProgress'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Form, Formik, type FormikValues, useFormikContext } from 'formik'
import { Activity, useState } from 'react'
import myAxios from '@/lib/axios'
import ConfirmationDialog from './confirmation-dialog'

export default function DialogFormik<T extends FormikValues>({
    axiosConfig,
    initialValues,
    formFields,
    onReset,
    onSubmitted,
    slotProps,
    title,
}: {
    axiosConfig: AxiosRequestConfig
    initialValues: T | null
    formFields: () => React.ReactNode
    onReset: () => void
    onSubmitted: (response: AxiosResponse) => void
    slotProps?: {
        dialog?: Partial<DialogProps>
    }
    title: string
}) {
    if (!initialValues) {
        return null
    }

    return (
        <Formik
            component={() => (
                <DialogForm
                    dialogProps={slotProps?.dialog}
                    formFields={formFields}
                    title={title}
                />
            )}
            initialValues={initialValues}
            onReset={onReset}
            onSubmit={(values, { setErrors }) =>
                myAxios({ ...axiosConfig, data: values })
                    .then(onSubmitted)
                    .catch(error => {
                        if (error.response?.status === 422) {
                            setErrors(error.response.data.errors)
                        }
                    })
            }
        />
    )
}

function DialogForm({
    title,
    formFields: FormFields,
    dialogProps,
}: {
    title: string
    formFields: () => React.ReactNode
    dialogProps?: Partial<DialogProps>
}) {
    const [currentAction, setCurrentAction] = useState<
        'submitting' | 'canceling' | null
    >(null)
    const { handleReset, isSubmitting, handleSubmit } = useFormikContext()

    return (
        <>
            <Dialog fullWidth maxWidth="xs" open {...dialogProps}>
                <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
                    <LinearProgress
                        sx={{
                            left: 0,
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            zIndex: theme => theme.zIndex.appBar + 1,
                        }}
                    />
                </Activity>

                <DialogTitle>{title}</DialogTitle>

                <DialogContent>
                    <Form autoComplete="off">
                        <FormFields />
                    </Form>
                </DialogContent>

                <DialogActions>
                    <Button
                        loading={isSubmitting}
                        onClick={() => setCurrentAction('canceling')}
                        size="small">
                        Batal
                    </Button>
                    <Button
                        loading={isSubmitting}
                        onClick={() => setCurrentAction('submitting')}
                        size="small"
                        type="submit"
                        variant="contained">
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>

            <ConfirmationDialog
                onCancel={() => {
                    setCurrentAction(null)
                }}
                onConfirm={() => {
                    if (currentAction === 'canceling') {
                        handleReset()
                    } else if (currentAction === 'submitting') {
                        handleSubmit()
                    }

                    setCurrentAction(null)
                }}
                open={Boolean(currentAction)}
                title={
                    currentAction === 'canceling'
                        ? 'Apa Anda yakin ingin membatalkan pengisian?'
                        : 'Apa Anda yakin ingin menyimpan perubahan?'
                }
            />
        </>
    )
}
