import { forwardRef } from 'react'
import { FormDataProvider } from '@/providers/FormData'
import UserDetailCollapsibleCard from './CollapsibleCard'
import UserDetailDialogFormWithButton from './DialogFormWithButton'

const UserDetailCrud = forwardRef<HTMLDivElement>(
    function HarusDikasihNama(props, ref) {
        return (
            <div ref={ref} {...props}>
                <FormDataProvider>
                    <UserDetailCollapsibleCard
                        editButton={<UserDetailDialogFormWithButton />}
                    />
                </FormDataProvider>
            </div>
        )
    },
)

export { UserDetailCrud }
