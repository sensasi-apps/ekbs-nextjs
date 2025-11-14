// types

// vendors
import Box from '@mui/material/Box'
import type { ButtonProps } from '@mui/material/Button'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import useSWR from 'swr'
import type { StatCardProps } from '@/components/stat-card'
// components
import StatCard from '@/components/stat-card'
import type CashType from '@/types/orms/cash'
// utils
import numberToCurrency from '@/utils/number-to-currency'

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
            isLoading={cashLoading || walletLoading}
            title={title}
            {...props}>
            <Box minWidth={MIN_WIDTH}>
                <Grid container spacing={0.5}>
                    <Grid container size={{ xs: (maxPositive / max) * 12 }}>
                        <Grid size={{ xs: (totalCash / maxPositive) * 12 }}>
                            <Box display="flex" gap={0.5}>
                                {cashData?.map(({ uuid, name, balance }) =>
                                    balance < 0 ? null : (
                                        <ItemBar
                                            color={
                                                balance < 0
                                                    ? 'error'
                                                    : 'success'
                                            }
                                            key={uuid}
                                            sx={{
                                                width: `${
                                                    (balance / totalCash) * 100
                                                }%`,
                                            }}
                                            title={`${name}: ${numberToCurrency(
                                                balance,
                                            )}`}>
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
                                <Typography fontWeight="bold" variant="caption">
                                    {numberToCurrency(totalCash)}
                                </Typography>
                            </Divider>
                        </Grid>

                        <Grid size={{ xs: (totalWallet / maxPositive) * 12 }}>
                            <Box display="flex" gap={0.5}>
                                {walletData?.map(({ value, label }) =>
                                    value < 0 ? null : (
                                        <ItemBar
                                            color={
                                                value < 0 ? 'error' : 'success'
                                            }
                                            key={`${label}-${value}`}
                                            sx={{
                                                width: `${
                                                    (Math.abs(value) /
                                                        totalWallet) *
                                                    100
                                                }%`,
                                            }}
                                            title={`${label}: ${numberToCurrency(
                                                value,
                                            )}`}>
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
                                <Typography fontWeight="bold" variant="caption">
                                    {numberToCurrency(totalWallet)}
                                </Typography>
                            </Divider>
                        </Grid>
                    </Grid>

                    <Grid container size={{ xs: (maxNegative / max) * 12 }}>
                        <Grid
                            height="50%"
                            size={{
                                xs:
                                    (Math.abs(totalNegativeCash) /
                                        maxNegative) *
                                    12,
                            }}>
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
                                                        color={
                                                            balance < 0
                                                                ? 'error'
                                                                : 'success'
                                                        }
                                                        key={uuid}
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
                                                        }}
                                                        title={`${name}: ${numberToCurrency(
                                                            balance,
                                                        )}`}>
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
                                            fontWeight="bold"
                                            variant="caption">
                                            {numberToCurrency(
                                                totalNegativeCash,
                                            )}
                                        </Typography>
                                    </Divider>
                                </>
                            )}
                        </Grid>

                        <Grid
                            height="50%"
                            size={{
                                xs:
                                    (Math.abs(totalNegativeWallet) /
                                        maxNegative) *
                                    12,
                            }}>
                            {totalNegativeWallet < 0 && (
                                <>
                                    <Box display="flex" gap={0.5}>
                                        {walletData?.map(({ value, label }) =>
                                            value < 0 ? (
                                                <ItemBar
                                                    color={
                                                        value < 0
                                                            ? 'error'
                                                            : 'success'
                                                    }
                                                    key={`${label}-${value}`}
                                                    sx={{
                                                        width: `${
                                                            (Math.abs(value) /
                                                                Math.abs(
                                                                    totalNegativeWallet,
                                                                )) *
                                                            100
                                                        }%`,
                                                    }}
                                                    title={`${label}: ${numberToCurrency(
                                                        value,
                                                    )}`}>
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
                                            fontWeight="bold"
                                            variant="caption">
                                            {numberToCurrency(
                                                totalNegativeWallet,
                                            )}
                                        </Typography>
                                    </Divider>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </StatCard>
    )
}

function ItemBar({ title, children, sx, ...props }: ButtonProps) {
    return (
        <Tooltip arrow placement="top" title={title}>
            <Button
                component="div"
                disableElevation
                disableRipple
                size="small"
                sx={{
                    minWidth: 'unset',
                    overflow: 'hidden',
                    px: 0.3,
                    textAlign: 'center',
                    ...sx,
                }}
                variant="contained"
                {...props}>
                <Box display="block" lineHeight={1.5} whiteSpace="nowrap">
                    {children}
                </Box>
            </Button>
        </Tooltip>
    )
}
