import { forwardRef } from 'react'
import { FormDataProvider } from '@/providers/FormData'
import UserDialogFormWithFab from './DialogFormWithFab'
import UserCard from './Card'

// there is no delete actually

const UserCrud = (props, ref) => (
    <FormDataProvider>
        <div ref={ref} {...props}>
            <UserCard />
        </div>
        <UserDialogFormWithFab />
    </FormDataProvider>
)

export default forwardRef(UserCrud)
