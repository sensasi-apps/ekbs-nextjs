import Dialog from '@/components/Global/Dialog'
import LoadingCenter from '@/components/loading-center'
import UserLandForm from '@/modules/user/components/user-land-form'
import useFormData from '@/providers/useFormData'
import type Land from '@/types/orms/land'
import useUserDetailSwr from '../../hooks/use-user-detail-swr'

export default function UserLandFormDialogWithUseContexts() {
    const { data: user } = useUserDetailSwr()
    const { data, isNew, formOpen, handleClose, loading, setSubmitting } =
        useFormData()

    if (!user) return <LoadingCenter />

    return (
        <Dialog
            closeButtonProps={{
                disabled: loading,
                onClick: handleClose,
            }}
            open={formOpen}
            title={`${isNew ? 'Tambah' : 'Perbarui'} Data Kebun`}>
            <UserLandForm
                data={data as Land}
                isLoading={loading}
                onCancel={handleClose}
                onSubmit={handleClose}
                setIsLoading={setSubmitting}
                userUuid={user.uuid}
            />
        </Dialog>
    )
}
