import { useState } from 'react'

import moment from 'moment'
import numberFormat from '@/lib/numberFormat'

import {
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Skeleton,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import HistoryIcon from '@mui/icons-material/History'
import UserActivityLogsTable from '../UserActivityLogs/Table'

import CloseIcon from '@mui/icons-material/Close'

export default function TransactionsTable({
    data: transactions = [],
    isLoading = false,
    handleEdit = () => null,
}) {
    const [selectedUserActivityLogs, setSelectedUserActivityLogs] =
        useState(undefined)
    const getColorByTransactionType = type => {
        if (type === 'transfer') return 'warning.main'
        if (type === 'income') return 'success.main'
        if (type === 'expense') return 'error.main'
    }

    function Rows() {
        if (transactions.length === 0)
            return (
                <TableRow>
                    <TableCell colSpan={9} align="center">
                        {isLoading && <Skeleton height="4em" />}
                        {!isLoading && <i>Tidak ada data</i>}
                    </TableCell>
                </TableRow>
            )

        if (transactions.length > 0)
            return transactions.map(transaction => {
                const {
                    uuid,
                    at,
                    amount,
                    cash,
                    user_activity_logs,
                    desc,
                    is_destination,
                    type,
                } = transaction

                return (
                    <TableRow
                        key={uuid}
                        sx={{
                            '&:last-child td, &:last-child th': {
                                border: 0,
                            },
                            'td, th': {
                                color: getColorByTransactionType(type),
                            },
                        }}>
                        <TableCell component="th" scope="row">
                            <Tooltip title={uuid}>
                                <span
                                    style={{
                                        borderBottom: '1px dashed',
                                    }}>
                                    ...{uuid.slice(-5)}
                                </span>
                            </Tooltip>
                        </TableCell>
                        <TableCell>{moment(at).format('DD-MM-YYYY')}</TableCell>
                        <TableCell>{cash.code}</TableCell>
                        <TableCell sx={{ textWrap: 'nowrap' }}>
                            {numberFormat(amount)}
                        </TableCell>
                        <TableCell>{desc}</TableCell>
                        <TableCell>
                            {user_activity_logs[0]?.user.name}
                        </TableCell>
                        <TableCell>
                            {!is_destination && (
                                <IconButton
                                    size="small"
                                    disabled={is_destination}
                                    onClick={() => handleEdit(transaction)}>
                                    <EditIcon />
                                </IconButton>
                            )}
                        </TableCell>
                        <TableCell>
                            {!is_destination && (
                                <IconButton
                                    size="small"
                                    disabled={is_destination}
                                    onClick={() =>
                                        setSelectedUserActivityLogs(
                                            transaction.user_activity_logs,
                                        )
                                    }>
                                    <HistoryIcon />
                                </IconButton>
                            )}
                        </TableCell>
                    </TableRow>
                )
            })
    }

    return (
        <>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kode</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Kode Kas</TableCell>
                            <TableCell>Jumlah</TableCell>
                            <TableCell>Deskripsi</TableCell>
                            <TableCell>Oleh</TableCell>
                            <TableCell />
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Rows />
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={selectedUserActivityLogs !== undefined}
                fullWidth
                onClose={() => setSelectedUserActivityLogs(undefined)}
                maxWidth="xs">
                <DialogTitle display="flex" justifyContent="space-between">
                    Riwayat data transaksi:
                    {selectedUserActivityLogs[0]?.model_uuid}
                    <IconButton
                        size="small"
                        onClick={() => setSelectedUserActivityLogs(undefined)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <UserActivityLogsTable data={selectedUserActivityLogs} />
                </DialogContent>
            </Dialog>
        </>
    )
}
