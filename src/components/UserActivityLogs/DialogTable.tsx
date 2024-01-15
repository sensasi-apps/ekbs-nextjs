// types
import type ActivityLogType from '@/dataTypes/ActivityLog'
// vendors
import { Dispatch, SetStateAction, memo } from 'react'
// materials
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
// icons
import CloseIcon from '@mui/icons-material/Close'
// components
import UserActivityLogsTable from './Table'

const UserActivityLogsDialogTable = memo(function UserActivityLogsDialogTable({
    open,
    data,
    setIsOpen,
}: {
    open: boolean
    data: ActivityLogType[]
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    return (
        <Dialog open={open}>
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontWeight="bold"
                // typography={false}
                component="div">
                Detail Log
                <IconButton onClick={() => setIsOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <UserActivityLogsTable data={data} />
            </DialogContent>
        </Dialog>
    )
})

export default UserActivityLogsDialogTable
