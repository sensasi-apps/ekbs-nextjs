// types
import type ActivityLogType from '@/types/orms/activity-log'
// vendors
import { memo, useState } from 'react'
// materials
import Button from '@mui/material/Button'
// icons
import InfoIcon from '@mui/icons-material/Info'
// components
import UserActivityLogsDialogTable from './DialogTable'

const UserActivityLogs = memo(function UserActivityLogs({
    data,
}: {
    data: ActivityLogType[]
}) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} startIcon={<InfoIcon />}>
                Riwayat Data
            </Button>
            <UserActivityLogsDialogTable
                open={open}
                setIsOpen={setOpen}
                data={data}
            />
        </>
    )
})

export default UserActivityLogs
