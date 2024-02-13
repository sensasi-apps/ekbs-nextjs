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
    const handleClose = () => setIsOpen(false)

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontWeight="bold"
                component="div">
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
})

export default UserActivityLogsDialogTable
