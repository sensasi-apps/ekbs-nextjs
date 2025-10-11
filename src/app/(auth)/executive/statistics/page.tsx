'use client'

// materials
import Box from '@mui/material/Box'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import PageTitle from '@/components/page-title'
// pages components
import TableOfContents from '@/components/pages/executive/statistics/charts/TableOfContents'
import BusinessUnitSection from '@/components/pages/executive/statistics/sections/BusinessUnit'
import FinanceSection from '@/components/pages/executive/statistics/sections/Finance'
import MemberSection from '@/components/pages/executive/statistics/sections/Member'
import ReceivableSection from '@/components/pages/executive/statistics/sections/Receivable'
import ScrollToTopFab from '@/components/ScrollToTopFab'

export default function Statistics() {
    return (
        <>
            <FlexColumnBox
                gap={4}
                sx={{
                    px: {
                        sm: 4,
                        xs: 'unset',
                    },
                }}>
                <Box>
                    <PageTitle
                        subtitle="Koperasi Belayan Sejahtera"
                        title="Statistik Keseluruhan"
                    />
                </Box>

                <TableOfContents />

                <MemberSection />
                <FinanceSection />
                <ReceivableSection />
                <BusinessUnitSection />
            </FlexColumnBox>

            <ScrollToTopFab />
        </>
    )
}
