// types
import type { StatCardProps } from '@/components/StatCard/StatCard'
import type CashType from '@/dataTypes/Cash'
// vendors
import useSWR from 'swr'
// materials
import Button, { ButtonProps } from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Grid2 from '@mui/material/Unstable_Grid2'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// components
import StatCard from '@/components/StatCard'
// utils
import numberToCurrency from '@/utils/numberToCurrency'

const MIN_WIDTH = 600

export default function AllCashChart({
    title = 'Alokasi/Distribusi Saldo',
    ...props
}: Omit<StatCardProps, 'title'> & {
    title?: string
}) {
    const { data: cashData, isLoading: cashLoading } =
        useSWR<CashType[]>('data/cashes')

    const { data: walletData, isLoading: walletLoading } = useSWR<
        {
            label: string
            value: number
        }[]
    >('cashes/all-wallet-balances-summary-data')

    const totalCash =
        cashData?.reduce(
            (acc, curr) => acc + (curr.balance < 0 ? 0 : curr.balance),
            0,
        ) ?? 0.001

    const totalNegativeCash =
        cashData?.reduce(
            (acc, curr) => acc + (curr.balance < 0 ? curr.balance : 0),
            0,
        ) ?? 0.001

    const totalWallet =
        walletData?.reduce(
            (acc, curr) => acc + (curr.value < 0 ? 0 : curr.value),
            0,
        ) ?? 0.001

    const totalNegativeWallet =
        walletData?.reduce(
            (acc, curr) => acc + (curr.value < 0 ? curr.value : 0),
            0,
        ) ?? 0.001

    const totalAbsCash = totalCash + Math.abs(totalNegativeCash)
    const totalAbsWallet = totalWallet + Math.abs(totalNegativeWallet)

    const maxPositive = Math.max(totalCash, totalWallet)
    const maxNegative = Math.max(
        Math.abs(totalNegativeCash),
        Math.abs(totalNegativeWallet),
    )

    const max = Math.max(totalAbsCash, totalAbsWallet)

    return (
        <StatCard
            title={title}
            isLoading={cashLoading || walletLoading}
            {...props}>
            <Box minWidth={MIN_WIDTH}>
                <Grid2 container spacing={0.5}>
                    <Grid2 container xs={(maxPositive / max) * 12}>
                        <Grid2 xs={(totalCash / maxPositive) * 12}>
                            <Box display="flex" gap={0.5}>
                                {cashData?.map(({ uuid, name, balance }) =>
                                    balance < 0 ? null : (
                                        <ItemBar
                                            key={uuid}
                                            title={`${name}: ${numberToCurrency(
                                                balance,
                                            )}`}
                                            color={
                                                balance < 0
                                                    ? 'error'
                                                    : 'success'
                                            }
                                            sx={{
                                                width: `${
                                                    (balance / totalCash) * 100
                                                }%`,
                                            }}>
                                            <Box>{name}</Box>
                                            <Box>
                                                {numberToCurrency(balance, {
                                                    notation: 'compact',
                                                })}
                                            </Box>
                                        </ItemBar>
                                    ),
                                )}
                            </Box>

                            <Divider>
                                <Typography variant="caption" fontWeight="bold">
                                    {numberToCurrency(totalCash)}
                                </Typography>
                            </Divider>
                        </Grid2>

                        <Grid2 xs={(totalWallet / maxPositive) * 12}>
                            <Box display="flex" gap={0.5}>
                                {walletData?.map(({ value, label }, index) =>
                                    value < 0 ? null : (
                                        <ItemBar
                                            key={index}
                                            title={`${label}: ${numberToCurrency(
                                                value,
                                            )}`}
                                            color={
                                                value < 0 ? 'error' : 'success'
                                            }
                                            sx={{
                                                width: `${
                                                    (Math.abs(value) /
                                                        totalWallet) *
                                                    100
                                                }%`,
                                            }}>
                                            <Box>{label}</Box>
                                            <Box>
                                                {numberToCurrency(value, {
                                                    notation: 'compact',
                                                })}
                                            </Box>
                                        </ItemBar>
                                    ),
                                )}
                            </Box>

                            <Divider>
                                <Typography variant="caption" fontWeight="bold">
                                    {numberToCurrency(totalWallet)}
                                </Typography>
                            </Divider>
                        </Grid2>
                    </Grid2>

                    <Grid2 container xs={(maxNegative / max) * 12}>
                        <Grid2
                            xs={
                                (Math.abs(totalNegativeCash) / maxNegative) * 12
                            }
                            height="50%">
                            {totalNegativeCash < 0 && (
                                <>
                                    <Box
                                        display="flex"
                                        flexDirection="row"
                                        gap={0.5}>
                                        {cashData?.map(
                                            ({ uuid, name, balance }) =>
                                                balance >= 0 ? null : (
                                                    <ItemBar
                                                        key={uuid}
                                                        title={`${name}: ${numberToCurrency(
                                                            balance,
                                                        )}`}
                                                        color={
                                                            balance < 0
                                                                ? 'error'
                                                                : 'success'
                                                        }
                                                        sx={{
                                                            width: `${
                                                                (Math.abs(
                                                                    balance,
                                                                ) /
                                                                    Math.abs(
                                                                        totalNegativeCash,
                                                                    )) *
                                                                100
                                                            }%`,
                                                        }}>
                                                        <Box>{name}</Box>
                                                        <Box>
                                                            {numberToCurrency(
                                                                balance,
                                                                {
                                                                    notation:
                                                                        'compact',
                                                                },
                                                            )}
                                                        </Box>
                                                    </ItemBar>
                                                ),
                                        )}
                                    </Box>
                                    <Divider>
                                        <Typography
                                            variant="caption"
                                            fontWeight="bold">
                                            {numberToCurrency(
                                                totalNegativeCash,
                                            )}
                                        </Typography>
                                    </Divider>
                                </>
                            )}
                        </Grid2>

                        <Grid2
                            xs={
                                (Math.abs(totalNegativeWallet) / maxNegative) *
                                12
                            }
                            height="50%">
                            {totalNegativeWallet < 0 && (
                                <>
                                    <Box display="flex" gap={0.5}>
                                        {walletData?.map(
                                            ({ value, label }, index) =>
                                                value < 0 ? (
                                                    <ItemBar
                                                        key={index}
                                                        title={`${label}: ${numberToCurrency(
                                                            value,
                                                        )}`}
                                                        color={
                                                            value < 0
                                                                ? 'error'
                                                                : 'success'
                                                        }
                                                        sx={{
                                                            width: `${
                                                                (Math.abs(
                                                                    value,
                                                                ) /
                                                                    Math.abs(
                                                                        totalNegativeWallet,
                                                                    )) *
                                                                100
                                                            }%`,
                                                        }}>
                                                        <Box>{label}</Box>
                                                        <Box>
                                                            {numberToCurrency(
                                                                value,
                                                                {
                                                                    notation:
                                                                        'compact',
                                                                },
                                                            )}
                                                        </Box>
                                                    </ItemBar>
                                                ) : null,
                                        )}
                                    </Box>

                                    <Divider>
                                        <Typography
                                            variant="caption"
                                            fontWeight="bold">
                                            {numberToCurrency(
                                                totalNegativeWallet,
                                            )}
                                        </Typography>
                                    </Divider>
                                </>
                            )}
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Box>
        </StatCard>
    )
}

function ItemBar({ title, children, sx, ...props }: ButtonProps) {
    return (
        <Tooltip title={title} arrow placement="top">
            <Button
                disableRipple
                disableElevation
                size="small"
                variant="contained"
                component="div"
                sx={{
                    minWidth: 'unset',
                    px: 0.3,
                    overflow: 'hidden',
                    textAlign: 'center',
                    ...sx,
                }}
                {...props}>
                <Box display="block" lineHeight={1.5} whiteSpace="nowrap">
                    {children}
                </Box>
            </Button>
        </Tooltip>
    )
}
