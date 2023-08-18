import { FC } from 'react'

import Dialog from '@/components/Dialog'

import useUserWithDetails from '@/providers/UserWithDetails'
import useData from '@/providers/useData'
import UserLandForm from '.'

const UserLandFormhDialogWithUseContexts: FC<null> = () => {
    const { data: user } = useUserWithDetails()
    const { data, isNew, isOpen, handleClose, isLoading, setIsLoading } =
        useData()

    return (
        <Dialog
            open={isOpen}
            title={`${isNew ? 'Tambah' : 'Perbarui'} Data Kebun`}
            onCloseButtonClick={handleClose}
            isCloseDisabled={isLoading}>
            <UserLandForm
                data={data}
                userUuid={user?.uuid}
                onCancel={handleClose}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                onSubmit={handleClose}
            />
        </Dialog>
    )
}

export default UserLandFormhDialogWithUseContexts
