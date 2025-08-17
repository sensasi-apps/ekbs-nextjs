'use client'

// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// components
import PageTitle from '@/components/page-title'
// parts
import AllCashChart from './_parts/cash/all-cash-chart'
import CashCrud from './_parts/cash/crud'
import InOutCashChart from './_parts/cash/in-out-chart'
import TransactionsCrud from './_parts/transaction/crud'

export default function CashesPage() {
    return (
        <>
            <PageTitle title="Kas" />

            <Box display="flex" gap={2} flexDirection="column">
                <InOutCashChart />

                <AllCashChart />

                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexDirection: {
                            xs: 'column-reverse',
                            sm: 'column-reverse',
                            md: 'row',
                        },
                    }}>
                    <Grid
                        size={{
                            xs: 12,
                            sm: 12,
                            md: 8,
                        }}
                        display="flex"
                        flexDirection="column"
                        gap={3}>
                        <TransactionsCrud />
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            sm: 12,
                            md: 4,
                        }}>
                        <CashCrud />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
