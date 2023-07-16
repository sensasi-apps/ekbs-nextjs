import moment from 'moment'

import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton,
    Typography,
} from '@mui/material'

export default function UserActivityLogsTable({
    data: userActivityLogs = [],
    isLoading = false,
}) {
    const getColorByAction = action => {
        if (action === 'updated') return 'warning.main'
        if (action === 'created') return 'success.main'
        if (action === 'deleted') return 'error.main'
    }

    function Values({ model_value_changed }) {
        return Object.entries(model_value_changed).map(([key, value], i) => (
            <Typography key={i} variant="body2">
                <Typography variant="caption" color="gray" component="span">
                    {key}:&nbsp;
                </Typography>
                {value}
            </Typography>
        ))
    }

    function Rows() {
        if (userActivityLogs.length === 0)
            return (
                <TableRow>
                    <TableCell colSpan={7} align="center">
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
                            {moment(at).format('DD-MM-YYYY h:m:s')}
                        </TableCell>
                    </TableRow>
                ),
            )
    }

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
                    <Rows />
                </TableBody>
            </Table>
        </TableContainer>
    )
}
