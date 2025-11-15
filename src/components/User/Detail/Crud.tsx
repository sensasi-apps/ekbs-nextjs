import type { HTMLAttributes } from 'react'
import { FormDataProvider } from '@/providers/FormData'
import UserDetailCollapsibleCard from './collapsible-card'
import UserDetailDialogFormWithButton from './DialogFormWithButton'

export default function UserDetailCrud(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...props}>
            <FormDataProvider>
                <UserDetailCollapsibleCard
                    editButton={<UserDetailDialogFormWithButton />}
                />
            </FormDataProvider>
        </div>
    )
}
