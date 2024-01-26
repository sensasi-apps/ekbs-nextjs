// components
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@/components/pages/laporan-performa/Card'
import numberToCurrency from '@/utils/numberToCurrency'
import Divider from '@mui/material/Divider'
import useSWR from 'swr'
import CashType from '@/dataTypes/Cash'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

const MIN_WIDTH = 600

export default function AllCashChart() {
    const { data: cashData, isLoading: cashLoading } =
        useSWR<CashType[]>('data/cashes')
    const { data: walletData, isLoading: walletLoading } = useSWR<
        {
            label: string
            value: number
        }[]
    >('cashes/all-wallet-balances-summary-data')

    const totalCash =
        cashData?.reduce((acc, curr) => acc + curr.balance, 0) ?? 1
    const totalWallet =
        walletData?.reduce((acc, curr) => acc + curr.value, 0) ?? 1
    const max = Math.max(totalCash, totalWallet)

    return (
        <Card
            title="Alokasi/Distribusi Saldo"
            isLoading={cashLoading || walletLoading}
            collapsible>
            <Box minWidth={MIN_WIDTH}>
                <Box width={`${(totalCash / max) * 100}%`}>
                    <Box display="flex" flexDirection="row" gap={0.5}>
                        {cashData?.map(({ uuid, name, balance }) => (
                            <Tooltip
                                key={uuid}
                                title={`${name}: ${numberToCurrency(balance)}`}
                                arrow
                                placement="top">
                                <Button
                                    disableRipple
                                    disableElevation
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        minWidth: 'unset',
                                        width: `${
                                            (balance / totalCash) * 100
                                        }%`,
                                        overflow: 'hidden',
                                    }}>
                                    <Box display="block" lineHeight={1.5}>
                                        <Box>{name}</Box>
                                        <Box>{numberToCurrency(balance)}</Box>
                                    </Box>
                                </Button>
                            </Tooltip>
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
                    <Box display="flex" flexDirection="row" gap={0.5}>
                        {walletData?.map(({ value, label }, index) => (
                            <Tooltip
                                key={index}
                                title={`${label}: ${numberToCurrency(value)}`}
                                arrow
                                placement="top">
                                <Button
                                    disableRipple
                                    disableElevation
                                    size="small"
                                    variant="contained"
                                    color="success"
                                    sx={{
                                        minWidth: 'unset',
                                        width: `${
                                            (value / totalWallet) * 100
                                        }%`,
                                        overflow: 'hidden',
                                        px: 0.2,
                                    }}>
                                    <Box display="block" lineHeight={1.5}>
                                        <Box>{label}</Box>
                                        <Box>{numberToCurrency(value)}</Box>
                                    </Box>
                                </Button>
                            </Tooltip>
                        ))}
                    </Box>

                    <Divider>
                        <Typography variant="caption" fontWeight="bold">
                            {numberToCurrency(totalWallet)}
                        </Typography>
                    </Divider>
                </Box>
            </Box>
        </Card>
    )
}
