// types
import type { StatCardProps } from '@/components/StatCard/StatCard'
import type CashType from '@/dataTypes/Cash'
// vendors
import useSWR from 'swr'
// materials
import Button, { ButtonProps } from '@mui/material/Button'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
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
        cashData?.reduce((acc, curr) => acc + curr.balance, 0) ?? 0.001
    const totalWallet =
        walletData?.reduce((acc, curr) => acc + curr.value, 0) ?? 0.001
    const max = Math.max(totalCash, totalWallet)

    return (
        <StatCard
            title={title}
            isLoading={cashLoading || walletLoading}
            {...props}>
            <Box minWidth={MIN_WIDTH}>
                <Box width={`${(totalCash / max) * 100}%`}>
                    <Box display="flex" flexDirection="row" gap={0.5}>
                        {cashData?.map(({ uuid, name, balance }) => (
                            <ItemBar
                                key={uuid}
                                title={`${name}: ${numberToCurrency(balance)}`}
                                color={balance >= 0 ? 'success' : 'error'}
                                sx={{
                                    width: `${(balance / totalWallet) * 100}%`,
                                }}>
                                <Box>{name}</Box>
                                <Box>
                                    {numberToCurrency(balance, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </ItemBar>
                        ))}
                    </Box>
                    <Divider>
                        <Typography variant="caption" fontWeight="bold">
                            {numberToCurrency(totalCash)}
                        </Typography>
                    </Divider>
                </Box>
            </Box>

            <Box minWidth={MIN_WIDTH}>
                <Box width={`${(totalWallet / max) * 100}%`}>
                    <Box display="flex" gap={0.5}>
                        {walletData?.map(({ value, label }, index) => (
                            <ItemBar
                                key={index}
                                title={`${label}: ${numberToCurrency(value)}`}
                                color={value >= 0 ? 'success' : 'error'}
                                sx={{
                                    width: `${
                                        (Math.abs(value) / totalWallet) * 100
                                    }%`,
                                }}>
                                <Box>{label}</Box>
                                <Box>
                                    {numberToCurrency(value, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </ItemBar>
                        ))}
                    </Box>

                    <Divider>
                        <Typography variant="caption" fontWeight="bold">
                            {numberToCurrency(totalWallet)}
                        </Typography>
                    </Divider>
                </Box>
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
