import type Land from '@/modules/clm/types/orms/land'
import Dialog from '@/components/Global/Dialog'
import UserLandForm from '@/modules/user/components/user-land-form'
import useFormData from '@/providers/useFormData'
import useUserDetailSwr from '../../hooks/use-user-detail-swr'
import LoadingCenter from '@/components/loading-center'

export default function UserLandFormDialogWithUseContexts() {
    const { data: user } = useUserDetailSwr()
    const { data, isNew, formOpen, handleClose, loading, setSubmitting } =
        useFormData()

    if (!user) return <LoadingCenter />

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
                userUuid={user.uuid}
                onCancel={handleClose}
                isLoading={loading}
                setIsLoading={setSubmitting}
                onSubmit={handleClose}
            />
        </Dialog>
    )
}
