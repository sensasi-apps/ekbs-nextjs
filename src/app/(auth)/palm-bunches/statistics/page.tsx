'use client'

// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
// vendors
import useSWR from 'swr'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import PageTitle from '@/components/page-title'
// page components
import TbsSubsection from '@/components/pages/executive/statistics/sections/BusinessUnit/Tbs'
import StatCard from '@/components/stat-card'
// components
import BigNumber from '@/components/stat-card.big-number'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function FarmInputsStatistics() {
    const { data, isLoading } = useSWR<{
        balance: number
        in_out_balance: InOutLineChartProps['data']
    }>('palm-bunches/statistic-data')
    return (
        <>
            <PageTitle title="Statistik Unit Bisnis TBS" />

            <Grid container mb={1} spacing={1.5}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    size={{
                        sm: 4,
                        xs: 12,
                    }}>
                    <BigNumber
                        isLoading={isLoading}
                        primary={
                            <Tooltip
                                arrow
                                placement="top"
                                title={numberToCurrency(data?.balance ?? 0)}>
                                <Box component="span">
                                    {numberToCurrency(data?.balance ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        title="Saldo Unit"
                    />
                </Grid>

                <Grid
                    size={{
                        sm: 8,
                        xs: 12,
                    }}>
                    <StatCard
                        isLoading={isLoading}
                        title="Saldo Keluar-Masuk — Bulanan">
                        <InOutLineChart data={data?.in_out_balance} />
                    </StatCard>
                </Grid>
            </Grid>
            <TbsSubsection />
        </>
    )
}
