// vendors
import { memo } from 'react'
// materials
import Grid2 from '@mui/material/Grid2'
// icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
// page components
import AllCashChart from '@/components/pages/cashes/Cash/AllCashChart'
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import InOutCashChart, {
    type InOutCashChartDataType,
} from '@/components/pages/cashes/Cash/InOutChart'
import useSWR from 'swr'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'

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
            <Grid2 container spacing={1.5}>
                <Grid2 size={{ xs: 12 }}>
                    <InOutCashChart
                        title="KOPERASI — Bulanan"
                        data={data?.all}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InOutCashChart
                        title="ALAT BERAT — Bulanan"
                        data={data?.alat_berat}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InOutCashChart
                        title="SAPRODI — Bulanan"
                        data={data?.saprodi}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InOutCashChart
                        title="SPP — Bulanan"
                        data={data?.spp}
                        isLoading={isLoading}
                        disableAutoFetch
                    />
                </Grid2>

                <Grid2 size={{ xs: 12, sm: 6 }}>
                    <InOutCashChart
                        title="TBS — Bulanan"
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
