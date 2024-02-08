// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ForestIcon from '@mui/icons-material/Forest'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import AuthLayout from '@/components/Layouts/AuthLayout'
// pages components
import InOutCashChart from '@/components/pages/cashes/Cash/InOutChart'
import AllCashChart from '@/components/pages/cashes/Cash/AllCashChart'
import TableOfContents from '@/components/pages/executive/statistics/charts/TableOfContents'
import ScrollableXBox from '@/components/ScrollableXBox'
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import MemberSection from '@/components/pages/executive/statistics/sections/Member'

export default function Statistics() {
    return (
        <AuthLayout title="Statistik">
            <FlexColumnBox gap={4}>
                <Box>
                    <Typography variant="h4" component="h1">
                        Statistik Keseluruhan
                    </Typography>
                    <Typography variant="subtitle1">
                        Koperasi Belayan Sejahtera
                    </Typography>
                </Box>

                <TableOfContents />

                <MemberSection />
                {/* <FinanceSection /> */}
                {/* <ReceivableSection /> */}
                {/* <BusinessUnitSection /> */}
            </FlexColumnBox>
        </AuthLayout>
    )
}

function FinanceSection() {
    return (
        <FlexColumnBox>
            <Heading2 id="keuangan" startIcon={<QuestionAnswerIcon />}>
                Keuangan
            </Heading2>

            <AllCashChart id="alokasi-distribusi-saldo" />

            <InOutCashChart id="saldo-masuk-keluar" />

            <ScrollableXBox
                sx={{
                    '& > *': {
                        minWidth: 300,
                    },
                }}>
                <InOutCashChart />
                <InOutCashChart />
                <InOutCashChart />
                <InOutCashChart />
            </ScrollableXBox>
        </FlexColumnBox>
    )
}

function ReceivableSection() {
    return (
        <FlexColumnBox>
            <Heading2 id="piutang" startIcon={<WorkIcon />}>
                Piutang
            </Heading2>

            <InOutCashChart />

            <ScrollableXBox
                sx={{
                    '& > *': {
                        minWidth: 300,
                    },
                }}>
                <InOutCashChart />
                <InOutCashChart />
                <InOutCashChart />
                <InOutCashChart />
            </ScrollableXBox>
        </FlexColumnBox>
    )
}

function BusinessUnitSection() {
    return (
        <FlexColumnBox>
            <Heading2 id="unit-bisnis" startIcon={<WorkIcon />}>
                Unit Bisnis
            </Heading2>

            <Heading3 startIcon={<ForestIcon />}>TBS</Heading3>

            <Heading3 startIcon={<WarehouseIcon />}>SAPRODI</Heading3>

            <Heading3 startIcon={<AgricultureIcon />}>
                Penyewaan Alat Berat
            </Heading3>

            <Heading3 startIcon={<CurrencyExchangeIcon />}>
                Simpan Pinjam
            </Heading3>
        </FlexColumnBox>
    )
}
