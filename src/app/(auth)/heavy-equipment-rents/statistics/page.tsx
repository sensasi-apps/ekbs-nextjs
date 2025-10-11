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
import AlatBeratSubsection from '@/components/pages/executive/statistics/sections/BusinessUnit/AlatBerat'
import StatCard from '@/components/StatCard'
// components
import BigNumber from '@/components/StatCard/BigNumber'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function HeavyEquipmentRentsStatistics() {
    const { data, isLoading } = useSWR<{
        balance: number
        receivable: number
        receivable_pass_due: number
        in_out_balance: InOutLineChartProps['data']
    }>('heavy-equipment-rents/statistic-data')
    return (
        <>
            <PageTitle title="Statistik Unit Bisnis Alat Berat" />

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

                    <BigNumber
                        isLoading={isLoading}
                        primary={
                            <Tooltip
                                arrow
                                placement="top"
                                title={numberToCurrency(data?.receivable ?? 0)}>
                                <Box component="span">
                                    {numberToCurrency(data?.receivable ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        secondary={
                            <Tooltip
                                arrow
                                placement="top"
                                title={`Lewat Jatuh Tempo: ${numberToCurrency(
                                    data?.receivable_pass_due ?? 0,
                                )}`}>
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
                        title="Piutang"
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
            <AlatBeratSubsection />
        </>
    )
}
