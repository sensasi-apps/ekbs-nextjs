'use client'

// materials
import Box from '@mui/material/Box'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import PageTitle from '@/components/page-title'
// pages components
import TableOfContents from '@/components/pages/executive/statistics/charts/TableOfContents'
import MemberSection from '@/components/pages/executive/statistics/sections/Member'
import FinanceSection from '@/components/pages/executive/statistics/sections/Finance'
import ReceivableSection from '@/components/pages/executive/statistics/sections/Receivable'
import BusinessUnitSection from '@/components/pages/executive/statistics/sections/BusinessUnit'
import ScrollToTopFab from '@/components/ScrollToTopFab'

export default function Statistics() {
    return (
        <>
            <FlexColumnBox
                gap={4}
                sx={{
                    px: {
                        xs: 'unset',
                        sm: 4,
                    },
                }}>
                <Box>
                    <PageTitle
                        title="Statistik Keseluruhan"
                        subtitle="Koperasi Belayan Sejahtera"
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
