import { forwardRef } from 'react'
import { FormDataProvider } from '@/providers/FormData'
import UserDetailCollapsibleCard from './CollapsibleCard'
import UserDetailDialogFormWithButton from './DialogFormWithButton'

const UserDetailCrud = (props, ref) => (
    <div ref={ref} {...props}>
        <FormDataProvider>
            <UserDetailCollapsibleCard
                editButton={<UserDetailDialogFormWithButton />}
            />
        </FormDataProvider>
    </div>
)

export default forwardRef(UserDetailCrud)
