// types
import type ProductMovementOpname from '@/@types/Data/Mart/Product/MovementOpname'
// vendors
import { Table, TableBody, TableCell, TableRow } from '@mui/material'
import { memo } from 'react'
import dayjs from 'dayjs'
// utils
import formatNumber from '@/utils/formatNumber'

function SummaryTable({ data }: { data: ProductMovementOpname }) {
    return (
        <Table
            size="small"
            sx={{
                width: 'unset',
                '& td': {
                    py: 0.3,
                    borderBottom: 'unset',
                },
            }}>
            <TableBody>
                <TableRow>
                    <TableCell>Kode</TableCell>
                    <TableCell>: {data.short_uuid}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>
                        : {dayjs(data.at).format('DD MMMM YYYY')}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Dibuat oleh</TableCell>
                    <TableCell>
                        : #{data.by_user?.id} — {data.by_user?.name}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Jumlah Produk</TableCell>
                    <TableCell>: {formatNumber(data.details.length)}</TableCell>
                </TableRow>

                <TableRow
                    sx={{
                        displayPrint: data.finished_at ? undefined : 'none',
                    }}>
                    <TableCell>Persediaan Ditemukan</TableCell>
                    <TableCell>
                        :{' '}
                        {formatNumber(
                            data.details.reduce(
                                (acc, { qty }) => acc + (qty > 0 ? qty : 0),
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{
                        displayPrint: data.finished_at ? undefined : 'none',
                    }}>
                    <TableCell>Persediaan Hilang</TableCell>
                    <TableCell>
                        :{' '}
                        {formatNumber(
                            data.details.reduce(
                                (acc, { qty }) => acc + (qty < 0 ? qty : 0),
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{
                        displayPrint: data.finished_at ? undefined : 'none',
                    }}>
                    <TableCell>Nilai Ditemukan</TableCell>
                    <TableCell>
                        : Rp{' '}
                        {formatNumber(
                            data.details.reduce(
                                (acc, { qty, warehouse_state }) =>
                                    acc +
                                    (qty > 0
                                        ? qty *
                                          (warehouse_state?.cost_rp_per_unit ??
                                              0)
                                        : 0),
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{
                        displayPrint: data.finished_at ? undefined : 'none',
                    }}>
                    <TableCell>Nilai Hilang</TableCell>
                    <TableCell>
                        : Rp{' '}
                        {formatNumber(
                            data.details.reduce(
                                (acc, { qty, warehouse_state }) =>
                                    acc +
                                    (qty < 0
                                        ? qty *
                                          (warehouse_state?.cost_rp_per_unit ??
                                              0)
                                        : 0),
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>

                <TableRow
                    sx={{
                        displayPrint: data.finished_at ? undefined : 'none',
                    }}>
                    <TableCell>Total Selisih</TableCell>
                    <TableCell>
                        : Rp{' '}
                        {formatNumber(
                            data.details.reduce(
                                (acc, detail) =>
                                    acc +
                                    detail.qty *
                                        (detail.warehouse_state
                                            ?.cost_rp_per_unit ?? 0),
                                0,
                            ),
                        )}
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

export default memo(SummaryTable)
