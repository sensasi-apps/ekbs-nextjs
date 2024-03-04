// types
import type Payroll from '@/dataTypes/Payroll'
import type PayrollUser from '@/dataTypes/PayrollUser'
// vendors
import { memo } from 'react'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
// components
import InfoBox from '@/components/InfoBox'
import Image from 'next/image'
import {
    TableBody,
    TableCell,
    TableRow,
    Typography,
    TableHead,
    TableContainer,
    TableFooter,
} from '@mui/material'
import FlexColumnBox from '@/components/FlexColumnBox'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

const SX_BORDER_LEFT = {
    borderLeft: '1px solid',
}

const PayrollSlip = memo(function PayrollSlip({
    payrollData: { at, note, processed_by_user },
    data: { user_state, details, uuid },
}: {
    payrollData: Payroll
    data: PayrollUser
}) {
    const earnings = details?.filter(detail => detail.amount_rp >= 0)
    const deductions = details?.filter(detail => detail.amount_rp < 0)

    return (
        <FlexColumnBox mt={2}>
            <Box display="flex" gap={3} alignItems="center">
                <Image
                    src="/assets/pwa-icons/green-transparent.svg"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                    priority
                />

                <Box>
                    <Typography variant="h6" lineHeight={1}>
                        Slip Gaji Karyawan
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                        Koperasi Belayan Sejahtera
                    </Typography>
                    <Typography variant="caption" component="div">
                        {dayjs(at).format('D MMMM YYYY')}
                    </Typography>
                    <Typography variant="caption" component="div">
                        {note}
                    </Typography>
                    <Typography variant="caption" component="div">
                        {uuid}
                    </Typography>
                </Box>
            </Box>

            <InfoBox
                sx={{
                    td: {
                        lineHeight: '1rem',
                    },
                }}
                data={[
                    {
                        label: 'ID',
                        value: user_state?.id ?? '-',
                    },
                    {
                        label: 'Nama',
                        value: user_state?.name ?? '-',
                    },
                    {
                        label: 'Jabatan',
                        value: user_state?.employee?.position ?? '-',
                    },
                    {
                        label: 'Status',
                        value:
                            user_state?.employee?.employee_status?.name ?? '-',
                    },
                    // {
                    //     label: 'Total Bersih',
                    //     value: numberToCurrency(
                    //         details?.reduce(
                    //             (a, b) =>
                    //                 a +
                    //                 parseFloat(
                    //                     (b.amount_rp as unknown as string) ?? 0,
                    //                 ),
                    //             0,
                    //         ) ?? 0,
                    //     ),
                    // },
                ]}
            />

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2} component="th">
                                Penghasilan
                            </TableCell>
                            <TableCell
                                colSpan={2}
                                component="th"
                                sx={SX_BORDER_LEFT}>
                                Potongan
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(
                            ((earnings?.length ?? 0) >=
                            (deductions?.length ?? 0)
                                ? earnings
                                : deductions) ?? []
                        ).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>{earnings?.[i]?.name}</TableCell>
                                <TableCell>
                                    {earnings?.[i]?.amount_rp
                                        ? numberToCurrency(
                                              earnings[i].amount_rp,
                                          )
                                        : ''}
                                </TableCell>
                                <TableCell sx={SX_BORDER_LEFT}>
                                    {deductions?.[i]?.name}
                                </TableCell>
                                <TableCell>
                                    {deductions?.[i]?.amount_rp
                                        ? numberToCurrency(
                                              deductions[i].amount_rp,
                                          )
                                        : ''}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell component="th">Total</TableCell>
                            <TableCell component="th">
                                {numberToCurrency(
                                    earnings?.reduce(
                                        (a, b) => a + b.amount_rp,
                                        0,
                                    ) ?? 0,
                                )}
                            </TableCell>
                            <TableCell sx={SX_BORDER_LEFT} />
                            <TableCell component="th">
                                {numberToCurrency(
                                    deductions?.reduce(
                                        (a, b) => a + b.amount_rp,
                                        0,
                                    ) ?? 0,
                                )}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>

            <InfoBox
                data={[
                    {
                        label: 'Penerimaan Bersih',
                        value: numberToCurrency(
                            details?.reduce(
                                (a, b) =>
                                    a +
                                    parseFloat(
                                        (b.amount_rp as unknown as string) ?? 0,
                                    ),
                                0,
                            ) ?? 0,
                        ),
                    },
                ]}
            />

            <Box>
                <Typography>
                    Desa Muai, {dayjs(at).format('D MMMM YYYY')}
                </Typography>
                <Typography mb={4}>
                    {processed_by_user?.employee?.employee_status?.name ??
                        '[Jabatan]'}
                </Typography>
                <Typography>{processed_by_user?.name ?? '[Nama]'}</Typography>
            </Box>
        </FlexColumnBox>
    )
})

export default PayrollSlip
