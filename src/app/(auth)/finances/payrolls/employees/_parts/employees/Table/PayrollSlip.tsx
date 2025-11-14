// types

// materials
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import Image from 'next/image'
// vendors
import { memo } from 'react'
// components
import FlexColumnBox from '@/components/flex-column-box'
import InfoBox from '@/components/InfoBox'
import type Payroll from '@/types/orms/payroll'
import type PayrollUser from '@/types/orms/payroll-user'
// utils
import numberToCurrency from '@/utils/number-to-currency'

const SX_BORDER_LEFT = {
    borderLeft: '1px solid',
}

const PayrollSlip = memo(function PayrollSlip({
    payrollData: { at, note, processed_by_user },
    data: { user_state, details, uuid },
    isPreview = false,
}: {
    payrollData: Payroll
    data: PayrollUser
    isPreview?: boolean
}) {
    const earnings = details?.filter(detail => detail.amount_rp >= 0)
    const deductions = details?.filter(detail => detail.amount_rp < 0)

    return (
        <FlexColumnBox mt={2}>
            <Box alignItems="center" display="flex" gap={3}>
                <Image
                    alt="logo"
                    height={0}
                    sizes="100vw"
                    src="/assets/pwa-icons/green-transparent.svg"
                    style={{ height: '6em', width: '6em' }}
                    width={0}
                />

                <Box>
                    <Typography lineHeight={1} variant="h6">
                        {isPreview ? 'Pratinjau' : 'Slip Gaji'}
                    </Typography>
                    <Typography gutterBottom variant="body1">
                        Koperasi Belayan Sejahtera
                    </Typography>
                    <Typography component="div" variant="caption">
                        {dayjs(at).format('D MMMM YYYY')}
                    </Typography>
                    <Typography component="div" variant="caption">
                        {note}
                    </Typography>
                    <Typography component="div" variant="caption">
                        {uuid}
                    </Typography>
                </Box>
            </Box>

            <Box>
                <InfoBox
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
                                user_state?.employee?.employee_status?.name ??
                                '-',
                        },
                    ]}
                    sx={{
                        td: {
                            lineHeight: '1rem',
                        },
                    }}
                />
            </Box>

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
                    <TableBody
                        sx={{
                            '& td': {
                                px: 1,
                                py: 0,
                            },
                        }}>
                        {(
                            ((earnings?.length ?? 0) >=
                            (deductions?.length ?? 0)
                                ? earnings
                                : deductions) ?? []
                        ).map(({ uuid }, i) => (
                            <TableRow key={uuid}>
                                <TableCell width="30%">
                                    {earnings?.[i]?.name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        whiteSpace: 'nowrap',
                                    }}
                                    width="20%">
                                    {earnings?.[i]?.amount_rp
                                        ? numberToCurrency(
                                              earnings[i].amount_rp,
                                          )
                                        : ''}
                                </TableCell>
                                <TableCell sx={SX_BORDER_LEFT} width="30%">
                                    {deductions?.[i]?.name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        whiteSpace: 'nowrap',
                                    }}
                                    width="20%">
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

            {!isPreview && (
                <Box>
                    <Typography>
                        Desa Muai, {dayjs(at).format('D MMMM YYYY')}
                    </Typography>
                    {processed_by_user?.employee?.employee_status?.name && (
                        <Typography>
                            {processed_by_user?.employee?.employee_status?.name}
                        </Typography>
                    )}
                    <Typography mt={4}>{processed_by_user?.name}</Typography>
                </Box>
            )}
        </FlexColumnBox>
    )
})

export default PayrollSlip
