import type LaravelValidationException from '@/types/LaravelValidationException'
import type User from '@/dataTypes/User'
import { Formik } from 'formik'
import EmployeeDetailBox from './DetailBox'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material'
import EmployeeForm from './Form'
import { useState } from 'react'
import axios from '@/lib/axios'
import { mutate } from 'swr'
import { AxiosError } from 'axios'
import { UUID } from 'crypto'
import { LoadingButton } from '@mui/lab'

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
                                mutate(`/users/${userUuid}`)
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

                                <LoadingButton
                                    variant="contained"
                                    loading={props.isSubmitting}
                                    form={FORM_ID}
                                    type="submit">
                                    Simpan
                                </LoadingButton>
                            </DialogActions>
                        </Dialog>
                    )}
                />
            )}
        </>
    )
}
