import type Land from '@/modules/clm/types/orms/land'
import Dialog from '@/components/Global/Dialog'
import useUserWithDetails from '@/app/(auth)/systems/users/[[...uuid]]/_parts/user-with-details-provider'
import UserLandForm from '@/modules/user/components/user-land-form'
import useFormData from '@/providers/useFormData'

export default function UserLandFormDialogWithUseContexts() {
    const { data: user } = useUserWithDetails()
    const { data, isNew, formOpen, handleClose, loading, setSubmitting } =
        useFormData()

    return (
        <Dialog
            open={formOpen}
            title={`${isNew ? 'Tambah' : 'Perbarui'} Data Kebun`}
            closeButtonProps={{
                onClick: handleClose,
                disabled: loading,
            }}>
            <UserLandForm
                data={data as Land}
                userUuid={user?.uuid}
                onCancel={handleClose}
                isLoading={loading}
                setIsLoading={setSubmitting}
                onSubmit={handleClose}
            />
        </Dialog>
    )
}
