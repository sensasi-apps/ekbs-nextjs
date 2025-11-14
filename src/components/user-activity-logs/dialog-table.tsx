// types

// icons
import CloseIcon from '@mui/icons-material/Close'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
// vendors
import { type Dispatch, type SetStateAction } from 'react'
import type ActivityLogType from '@/types/orms/activity-log'
// components
import UserActivityLogsTable from './table'

function UserActivityLogsDialogTable({
    open,
    data,
    setIsOpen,
}: {
    open: boolean
    data: ActivityLogType[]
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) {
    const handleClose = () => setIsOpen(false)

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle
                alignItems="center"
                component="div"
                display="flex"
                fontWeight="bold"
                justifyContent="space-between">
                Detail Log
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <UserActivityLogsTable data={data} />
            </DialogContent>
        </Dialog>
    )
}

export default UserActivityLogsDialogTable
