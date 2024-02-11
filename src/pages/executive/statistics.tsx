// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// icons
import AgricultureIcon from '@mui/icons-material/Agriculture'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import ForestIcon from '@mui/icons-material/Forest'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import WorkIcon from '@mui/icons-material/Work'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import AuthLayout from '@/components/Layouts/AuthLayout'
// pages components
import TableOfContents from '@/components/pages/executive/statistics/charts/TableOfContents'
import Heading2 from '@/components/pages/executive/statistics/Heading2'
import Heading3 from '@/components/pages/executive/statistics/Heading3'
import MemberSection from '@/components/pages/executive/statistics/sections/Member'
import FinanceSection from '@/components/pages/executive/statistics/sections/Finance'
import ReceivableSection from '@/components/pages/executive/statistics/sections/Receivable'

export default function Statistics() {
    return (
        <AuthLayout title="Statistik">
            <FlexColumnBox
                gap={4}
                sx={{
                    px: {
                        xs: 'unset',
                        sm: 4,
                    },
                }}>
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
                <FinanceSection />
                <ReceivableSection />
                {/* <BusinessUnitSection /> */}
            </FlexColumnBox>
        </AuthLayout>
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
