// vendors
import type { UUID } from 'crypto'
import { type AxiosError } from 'axios'
import { Formik } from 'formik'
import { useState } from 'react'
import { mutate } from 'swr'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
//
import type LaravelValidationException from '@/types/LaravelValidationException'
import type User from '@/features/user/types/user'
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
                                    variant="contained"
                                    loading={props.isSubmitting}
                                    form={FORM_ID}
                                    type="submit">
                                    Simpan
                                </Button>
                            </DialogActions>
                        </Dialog>
                    )}
                />
            )}
        </>
    )
}
