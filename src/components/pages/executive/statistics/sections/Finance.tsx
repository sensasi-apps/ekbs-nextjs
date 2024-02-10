// vendors
import { memo } from 'react'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
// page components
import AllCashChart from '@/components/pages/cashes/Cash/AllCashChart'
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import InOutCashChart, {
    InOutCashChartDataType,
} from '@/components/pages/cashes/Cash/InOutChart'
import useSWR from 'swr'

const FinanceSection = memo(function FinanceSection() {
    const { data, isLoading } = useSWR<{
        all: InOutCashChartDataType
        alat_berat: InOutCashChartDataType
        saprodi: InOutCashChartDataType
        spp: InOutCashChartDataType
        tbs: InOutCashChartDataType
    }>('executive/finance-section-data')

    return (
        <FlexColumnBox>
            <Heading2
                id="keuangan"
                startIcon={<AccountBalanceWalletIcon />}
                sx={{
                    scrollMarginTop: '6rem',
                }}>
                Keuangan
            </Heading2>

            <AllCashChart
                id="alokasi-distribusi-saldo"
                sx={{
                    scrollMarginTop: '6rem',
                }}
            />

            <Grid2 container spacing={2}>
                <Grid2 xs={12}>
                    <InOutCashChart
                        title="Saldo Masuk-Keluar KOPERASI — Bulanan"
                        id="saldo-masuk-keluar"
                        data={data?.all}
                        isLoading={isLoading}
                        disableAutoFetch
                        sx={{
                            scrollMarginTop: '6rem',
                        }}
                    />
                </Grid2>

                <Grid2 xs={12} sm={6}>
                    <InOutCashChart
                        title="ALAT BERAT"
                        data={data?.alat_berat}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 xs={12} sm={6}>
                    <InOutCashChart
                        title="SAPRODI"
                        data={data?.saprodi}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 xs={12} sm={6}>
                    <InOutCashChart
                        title="SPP"
                        data={data?.spp}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 xs={12} sm={6}>
                    <InOutCashChart
                        title="TBS"
                        data={data?.tbs}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>
            </Grid2>
        </FlexColumnBox>
    )
})

export default FinanceSection
