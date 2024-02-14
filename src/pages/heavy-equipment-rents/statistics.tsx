// materials
import Box from '@mui/material/Box'
import Grid2 from '@mui/material/Unstable_Grid2'
import Tooltip from '@mui/material/Tooltip'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import BigNumber from '@/components/StatCard/BigNumber'
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// page components
import AlatBeratSubsection from '@/components/pages/executive/statistics/sections/BusinessUnit/AlatBerat'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import useSWR from 'swr'

export default function HeavyEquipmentRentsStatistics() {
    const { data, isLoading } = useSWR<{
        balance: number
        receivable: number
        receivable_pass_due: number
        in_out_balance: InOutLineChartProps['data']
    }>('heavy-equipment-rents/statistic-data')
    return (
        <AuthLayout title="Statistik Unit Bisnis Alat Berat">
            <Grid2 container mb={1} spacing={1.5}>
                <Grid2
                    xs={12}
                    sm={4}
                    display="flex"
                    flexDirection="column"
                    gap={1.5}>
                    <BigNumber
                        title="Saldo Unit"
                        primary={
                            <Tooltip
                                title={numberToCurrency(data?.balance ?? 0)}
                                arrow
                                placement="top">
                                <Box component="span">
                                    {numberToCurrency(data?.balance ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        isLoading={isLoading}
                    />

                    <BigNumber
                        title="Piutang"
                        isLoading={isLoading}
                        primary={
                            <Tooltip
                                title={numberToCurrency(data?.receivable ?? 0)}
                                arrow
                                placement="top">
                                <Box component="span">
                                    {numberToCurrency(data?.receivable ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        secondary={
                            <Tooltip
                                title={`Lewat Jatuh Tempo: ${numberToCurrency(
                                    data?.receivable_pass_due ?? 0,
                                )}`}
                                arrow
                                placement="top">
                                <Box color="error.main" component="span">
                                    {numberToCurrency(
                                        data?.receivable_pass_due ?? 0,
                                        {
                                            notation: 'compact',
                                        },
                                    )}
                                </Box>
                            </Tooltip>
                        }
                    />
                </Grid2>

                <Grid2 xs={12} sm={8}>
                    <StatCard
                        title="Saldo Keluar-Masuk — Bulanan"
                        isLoading={isLoading}>
                        <InOutLineChart data={data?.in_out_balance} />
                    </StatCard>
                </Grid2>
            </Grid2>
            <AlatBeratSubsection />
        </AuthLayout>
    )
}
