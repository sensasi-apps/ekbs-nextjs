// types

// icons
import InfoIcon from '@mui/icons-material/Info'
// materials
import Button from '@mui/material/Button'
// vendors
import { memo, useState } from 'react'
import type ActivityLogType from '@/types/orms/activity-log'
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
                data={data}
                open={open}
                setIsOpen={setOpen}
            />
        </>
    )
})

export default UserActivityLogs
