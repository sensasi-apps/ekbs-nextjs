// materials
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import AuthLayout from '@/components/Layouts/AuthLayout'
// pages components
import TableOfContents from '@/components/pages/executive/statistics/charts/TableOfContents'
import MemberSection from '@/components/pages/executive/statistics/sections/Member'
import FinanceSection from '@/components/pages/executive/statistics/sections/Finance'
import ReceivableSection from '@/components/pages/executive/statistics/sections/Receivable'
import BusinessUnitSection from '@/components/pages/executive/statistics/sections/BusinessUnit'
import ScrollToTopFab from '@/components/ScrollToTopFab'

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
                <BusinessUnitSection />
            </FlexColumnBox>

            <ScrollToTopFab />
        </AuthLayout>
    )
}

export const SX_SCROLL_MARGIN_TOP = {
    scrollMarginTop: '6rem',
}
