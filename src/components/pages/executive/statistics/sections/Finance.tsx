'use client'

// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
// materials
import Grid from '@mui/material/Grid'
// vendors
import useSWR from 'swr'
// page components
import AllCashChart from '@/app/(auth)/finances/cashes/_parts/cash/all-cash-chart'
import InOutCashChart, {
    type InOutCashChartDataType,
} from '@/app/(auth)/finances/cashes/_parts/cash/in-out-chart'
// components
import FlexColumnBox from '@/components/flex-column-box'
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
// constants
import SX_SCROLL_MARGIN_TOP from '../SX_SCROLL_MARGIN_TOP'

export default function FinanceSection() {
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
                sx={SX_SCROLL_MARGIN_TOP}>
                Keuangan
            </Heading2>

            <AllCashChart
                id="alokasi-distribusi-saldo"
                sx={{
                    ...SX_SCROLL_MARGIN_TOP,
                    overflow: 'unset',
                }}
            />

            <Heading3
                id="saldo-masuk-keluar"
                startIcon={<AccountBalanceWalletIcon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                Saldo Masuk-Keluar
            </Heading3>
            <Grid container spacing={1.5}>
                <Grid size={{ xs: 12 }}>
                    <InOutCashChart
                        data={data?.all}
                        disableAutoFetch
                        isLoading={isLoading}
                        title="KOPERASI — Bulanan"
                    />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                    <InOutCashChart
                        data={data?.alat_berat}
                        disableAutoFetch
                        isLoading={isLoading}
                        title="ALAT BERAT — Bulanan"
                    />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                    <InOutCashChart
                        data={data?.saprodi}
                        disableAutoFetch
                        isLoading={isLoading}
                        title="SAPRODI — Bulanan"
                    />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                    <InOutCashChart
                        data={data?.spp}
                        disableAutoFetch
                        isLoading={isLoading}
                        title="SPP — Bulanan"
                    />
                </Grid>

                <Grid size={{ sm: 6, xs: 12 }}>
                    <InOutCashChart
                        data={data?.tbs}
                        disableAutoFetch
                        isLoading={isLoading}
                        title="TBS — Bulanan"
                    />
                </Grid>
            </Grid>
        </FlexColumnBox>
    )
}
