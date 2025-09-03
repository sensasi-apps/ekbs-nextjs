// types
import type InventoryItem from '@/types/orms/inventory-item'
// vendors
import { memo, useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// materials
import IconButton from '@mui/material/IconButton'
// icons
import EditIcon from '@mui/icons-material/Edit'
// components
import DialogWithTitle from '@/components/DialogWithTitle'
import FormikForm from '@/components/formik-form'
import TypographyWithLabel from '@/components/pages/user-loans/SummaryBox/TypographyWithLabel'
import UserAutocomplete from '@/components/UserAutocomplete'
// utils
import errorCatcher from '@/utils/handle-422'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import useAuthInfo from '@/hooks/use-auth-info'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

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
                            size="small"
                            color="info"
                            onClick={() => setIsDialogOpen(true)}>
                            <EditIcon />
                        </IconButton>
                    )}
                </TypographyWithLabel>

                <DialogWithTitle
                    title={`${
                        latestPic ? 'Tambah' : 'Perbaharui'
                    } Penanggung Jawab`}
                    open={isDialogOpen}>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            pic_user_uuid: null,
                        }}
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
                        }
                        onReset={() => setIsDialogOpen(false)}>
                        {({ dirty, isSubmitting, setFieldValue, errors }) => {
                            const isDisabled = isSubmitting

                            return (
                                <FormikForm
                                    id="inventory-item-pic-form"
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
                                    <UserAutocomplete
                                        label="Pilih Penanggung Jawab"
                                        disabled={isDisabled}
                                        fullWidth
                                        onChange={(_, user) => {
                                            setFieldValue(
                                                'pic_user_uuid',
                                                user?.uuid,
                                            )
                                        }}
                                        size="small"
                                        textFieldProps={{
                                            required: true,
                                            label: 'Pengguna',
                                            margin: 'dense',
                                            ...errorsToHelperTextObj(
                                                errors.pic_user_uuid,
                                            ),
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
