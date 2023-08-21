import { FC } from 'react'

import Dialog from '@/components/Global/Dialog'
import useUserWithDetails from '@/providers/UserWithDetails'
import UserLandForm from '.'
import useFormData from '@/providers/useFormData'
import Land from '@/types/Land'

const UserLandFormhDialogWithUseContexts: FC = () => {
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

export default UserLandFormhDialogWithUseContexts
