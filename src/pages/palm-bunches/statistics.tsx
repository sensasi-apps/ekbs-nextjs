// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
// components
import AuthLayout from '@/components/auth-layout'
import BigNumber from '@/components/StatCard/BigNumber'
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// page components
import TbsSubsection from '@/components/pages/executive/statistics/sections/BusinessUnit/Tbs'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function FarmInputsStatistics() {
    const { data, isLoading } = useSWR<{
        balance: number
        in_out_balance: InOutLineChartProps['data']
    }>('palm-bunches/statistic-data')
    return (
        <AuthLayout title="Statistik Unit Bisnis TBS">
            <Grid container mb={1} spacing={1.5}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    size={{
                        xs: 12,
                        sm: 4,
                    }}>
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
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 8,
                    }}>
                    <StatCard
                        title="Saldo Keluar-Masuk — Bulanan"
                        isLoading={isLoading}>
                        <InOutLineChart data={data?.in_out_balance} />
                    </StatCard>
                </Grid>
            </Grid>
            <TbsSubsection />
        </AuthLayout>
    )
}
