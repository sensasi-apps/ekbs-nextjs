// types

// icons
import EditIcon from '@mui/icons-material/Edit'
// materials
import IconButton from '@mui/material/IconButton'
import { Formik } from 'formik'
// vendors
import { memo, useState } from 'react'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import FormikForm from '@/components/formik-form'
import TypographyWithLabel from '@/components/pages/user-loans/SummaryBox/TypographyWithLabel'
import UserAutocomplete from '@/components/user-autocomplete'
import useAuthInfo from '@/hooks/use-auth-info'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type InventoryItem from '@/types/orms/inventory-item'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// utils
import errorCatcher from '@/utils/handle-422'

const AssignPicButtonAndDialogForm = memo(
    function AssignPicButtonAndDialogForm({
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
            isAuthHasPermission('inventory item update') ||
            user?.uuid === pic_user?.uuid

        return (
            <>
                <TypographyWithLabel label="Penanggung Jawab" mb={3}>
                    {pic_user ? `#${pic_user.id} ${pic_user.name}` : '-'}
                    {userCanUpdate && (
                        <IconButton
                            color="info"
                            onClick={() => setIsDialogOpen(true)}
                            size="small">
                            <EditIcon />
                        </IconButton>
                    )}
                </TypographyWithLabel>

                <DialogWithTitle
                    open={isDialogOpen}
                    title={`${
                        latestPic ? 'Tambah' : 'Perbaharui'
                    } Penanggung Jawab`}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            pic_user_uuid: null,
                        }}
                        onReset={() => setIsDialogOpen(false)}
                        onSubmit={(values, { setErrors }) =>
                            axios
                                .post(
                                    `inventory-items/${uuid}/assign-pic`,
                                    values,
                                )
                                .then(() => {
                                    onSubmit?.()
                                    setIsDialogOpen(false)
                                })
                                .catch(error => errorCatcher(error, setErrors))
                        }>
                        {({ dirty, isSubmitting, setFieldValue, errors }) => {
                            const isDisabled = isSubmitting

                            return (
                                <FormikForm
                                    autoComplete="off"
                                    dirty={dirty}
                                    id="inventory-item-pic-form"
                                    isNew={true}
                                    processing={isSubmitting}
                                    slotProps={{
                                        submitButton: {
                                            disabled: isDisabled,
                                        },
                                    }}
                                    submitting={isSubmitting}>
                                    <UserAutocomplete
                                        disabled={isDisabled}
                                        fullWidth
                                        label="Pilih Penanggung Jawab"
                                        onChange={(_, user) => {
                                            setFieldValue(
                                                'pic_user_uuid',
                                                user?.uuid,
                                            )
                                        }}
                                        size="small"
                                        slotProps={{
                                            textField: {
                                                label: 'Pengguna',
                                                ...errorsToHelperTextObj(
                                                    errors.pic_user_uuid,
                                                ),
                                            },
                                        }}
                                    />
                                </FormikForm>
                            )
                        }}
                    </Formik>
                </DialogWithTitle>
            </>
        )
    },
)

export default AssignPicButtonAndDialogForm
