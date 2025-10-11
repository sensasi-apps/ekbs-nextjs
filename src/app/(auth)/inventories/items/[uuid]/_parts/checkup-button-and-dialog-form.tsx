// types

// icons
import RateReview from '@mui/icons-material/RateReview'
// materials
import Button from '@mui/material/Button'
import { FastField, Formik } from 'formik'
// vendors
import { memo, useState } from 'react'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import FormikForm from '@/components/formik-form'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import useAuthInfo from '@/hooks/use-auth-info'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type InventoryItem from '@/types/orms/inventory-item'
// utils
import errorCatcher from '@/utils/handle-422'

const CheckupButtonAndDialogForm = memo(function CheckupButtonAndDialogForm({
    uuid,
    latestPic,
    onSubmit,
}: {
    uuid: InventoryItem['uuid']
    latestPic: InventoryItem['latest_pic'] | undefined
    onSubmit?: () => void
}) {
    const user = useAuthInfo()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const isAuthHasPermission = useIsAuthHasPermission()

    const { pic_user } = latestPic ?? {}

    const userCanUpdate =
        isAuthHasPermission(['inventory item update']) ||
        user?.uuid === pic_user?.uuid

    return (
        <>
            {userCanUpdate && (
                <Button
                    endIcon={<RateReview />}
                    onClick={() => setIsDialogOpen(true)}
                    size="small"
                    style={{
                        marginBottom: '1em',
                    }}
                    sx={{
                        mt: {
                            sm: 'unset',
                            xs: 1.5,
                        },
                    }}
                    variant="outlined">
                    Tambah Pemeriksaan
                </Button>
            )}

            <DialogWithTitle
                open={isDialogOpen}
                title="Tambah Catatan Pemeriksaan">
                <Formik
                    enableReinitialize
                    initialValues={{
                        note: undefined,
                    }}
                    onReset={() => setIsDialogOpen(false)}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(`inventory-items/${uuid}/checkup`, values)
                            .then(() => {
                                onSubmit?.()
                                setIsDialogOpen(false)
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }>
                    {({ dirty, isSubmitting }) => {
                        const isDisabled = isSubmitting

                        return (
                            <FormikForm
                                autoComplete="off"
                                dirty={dirty}
                                id="inventory-item-checkup-form"
                                isNew={true}
                                processing={isSubmitting}
                                slotProps={{
                                    submitButton: {
                                        disabled: isDisabled,
                                    },
                                }}
                                submitting={isSubmitting}>
                                <FastField
                                    component={TextFieldFastableComponent}
                                    disabled={isSubmitting}
                                    label="Pemeriksaan"
                                    multiline
                                    name="note"
                                    rows={2}
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
