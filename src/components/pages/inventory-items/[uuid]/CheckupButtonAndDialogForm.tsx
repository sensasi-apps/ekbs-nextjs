// types
import type InventoryItem from '@/dataTypes/InventoryItem'
// vendors
import { memo, useState } from 'react'
import { FastField, Formik } from 'formik'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
// icons
import RateReview from '@mui/icons-material/RateReview'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import FormikForm from '@/components/FormikForm'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// providers
import useAuth from '@/providers/Auth'
// utils
import errorCatcher from '@/utils/errorCatcher'

const CheckupButtonAndDialogForm = memo(function CheckupButtonAndDialogForm({
    uuid,
    latestPic,
    onSubmit,
}: {
    uuid: InventoryItem['uuid']
    latestPic: InventoryItem['latest_pic'] | undefined
    onSubmit?: () => void
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { userHasPermission, user } = useAuth()

    const { pic_user } = latestPic ?? {}

    const userCanUpdate =
        userHasPermission(['inventory item update']) ||
        user?.uuid === pic_user?.uuid

    return (
        <>
            {userCanUpdate && (
                <Button
                    endIcon={<RateReview />}
                    variant="outlined"
                    size="small"
                    sx={{
                        mt: {
                            xs: 1.5,
                            sm: 'unset',
                        },
                    }}
                    style={{
                        marginBottom: '1em',
                    }}
                    onClick={() => setIsDialogOpen(true)}>
                    Tambah Pemeriksaan
                </Button>
            )}

            <DialogWithTitle
                title="Tambah Catatan Pemeriksaan"
                open={isDialogOpen}>
                <Formik
                    enableReinitialize
                    initialValues={{
                        note: undefined,
                    }}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(`inventory-items/${uuid}/checkup`, values)
                            .then(() => {
                                onSubmit?.()
                                setIsDialogOpen(false)
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                    onReset={() => setIsDialogOpen(false)}>
                    {({ dirty, isSubmitting }) => {
                        const isDisabled = isSubmitting

                        return (
                            <FormikForm
                                id="inventory-item-checkup-form"
                                autoComplete="off"
                                isNew={true}
                                dirty={dirty}
                                submitting={isSubmitting}
                                processing={isSubmitting}
                                slotProps={{
                                    submitButton: {
                                        disabled: isDisabled,
                                    },
                                }}>
                                <FastField
                                    name="note"
                                    component={TextFieldFastableComponent}
                                    label="Pemeriksaan"
                                    multiline
                                    rows={2}
                                    disabled={isSubmitting}
                                />
                            </FormikForm>
                        )
                    }}
                </Formik>
            </DialogWithTitle>
        </>
    )
})

export default CheckupButtonAndDialogForm
