// vendors

import type { UUID } from 'node:crypto'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import type { AxiosError } from 'axios'
import { Formik } from 'formik'
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
import type User from '@/modules/user/types/orms/user'
//
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import EmployeeDetailBox from './DetailBox'
import EmployeeForm from './Form'

const FORM_ID = 'employee-form'

export default function UserEmployeeCrud({
    userUuid,
    data,
}: {
    userUuid: UUID
    data: User['employee']
}) {
    const [formValues, setFormValues] = useState<Partial<User['employee']>>()

    function handleFormClose() {
        setFormValues(undefined)
    }

    function handleEdit() {
        setFormValues(data ?? {})
    }

    return (
        <>
            <EmployeeDetailBox data={data} onClickEdit={handleEdit} />

            {formValues && (
                <Formik
                    component={props => (
                        <Dialog maxWidth="xs" open>
                            <DialogTitle>
                                Perbaharui Data Kepegawaian
                            </DialogTitle>
                            <DialogContent>
                                <EmployeeForm id={FORM_ID} {...props} />
                            </DialogContent>
                            <DialogActions>
                                <Button
                                    disabled={props.isSubmitting}
                                    onClick={props.handleReset}>
                                    Batal
                                </Button>

                                <Button
                                    form={FORM_ID}
                                    loading={props.isSubmitting}
                                    type="submit"
                                    variant="contained">
                                    Simpan
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                    id={FORM_ID}
                    initialValues={formValues}
                    onReset={handleFormClose}
                    onSubmit={(formValues, { setErrors }) =>
                        axios
                            .post(`/users/${userUuid}/employee`, formValues)
                            .then(() => {
                                mutate(`users/${userUuid}`)
                                handleFormClose()
                            })
                            .catch(
                                (
                                    error: AxiosError<LaravelValidationException>,
                                ) => {
                                    if (error?.response?.status === 422) {
                                        setErrors(error.response.data.errors)
                                    } else {
                                        throw error
                                    }
                                },
                            )
                    }
                />
            )}
        </>
    )
}
