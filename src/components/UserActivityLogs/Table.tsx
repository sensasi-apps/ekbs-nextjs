// types

// materials
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// vendors
import dayjs from 'dayjs'
import type ActivityLogType from '@/types/orms/activity-log'

export default function UserActivityLogsTable({
    data: userActivityLogs = [],
    isLoading = false,
}: {
    data?: ActivityLogType[]
    isLoading?: boolean
}) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Oleh</TableCell>
                        <TableCell>Data</TableCell>
                        <TableCell>Pada</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <Rows
                        isLoading={isLoading}
                        userActivityLogs={userActivityLogs}
                    />
                </TableBody>
            </Table>
        </TableContainer>
    )
}

function Rows({
    userActivityLogs,
    isLoading,
}: {
    userActivityLogs: ActivityLogType[]
    isLoading: boolean
}) {
    if (userActivityLogs.length === 0)
        return (
            <TableRow>
                <TableCell align="center" colSpan={7}>
                    {isLoading && <Skeleton height="4em" />}
                    {!isLoading && <i>Tidak ada data</i>}
                </TableCell>
            </TableRow>
        )

    if (userActivityLogs.length > 0)
        return userActivityLogs.map(
            ({ uuid, user, at, action, model_value_changed }) => (
                <TableRow
                    key={uuid}
                    sx={{
                        '&:last-child td, &:last-child th': {
                            border: 0,
                        },
                        'td, th': {
                            color: getColorByAction(action),
                        },
                    }}>
                    <TableCell>{user?.name}</TableCell>
                    <TableCell>
                        <Values model_value_changed={model_value_changed} />
                    </TableCell>
                    <TableCell>
                        {dayjs(at).format('YYYY-MM-DD HH:mm:ss')}
                    </TableCell>
                </TableRow>
            ),
        )
}

function Values({
    model_value_changed,
}: {
    model_value_changed: ActivityLogType['model_value_changed']
}) {
    // TODO: remove casting
    return Object.entries(model_value_changed as object).map(
        ([key, value], i) => (
            <Typography key={i} variant="body2">
                <Typography color="gray" component="span" variant="caption">
                    {key}:&nbsp;
                </Typography>
                {value as string}
            </Typography>
        ),
    )
}

function getColorByAction(action: ActivityLogType['action']) {
    if (action === 'updated') return 'warning.main'
    if (action === 'created') return 'success.main'
    if (action === 'deleted') return 'error.main'
}
