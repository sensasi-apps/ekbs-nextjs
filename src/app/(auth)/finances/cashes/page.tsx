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

            <Box display="flex" flexDirection="column" gap={2}>
                <InOutCashChart />

                <AllCashChart />

                <Grid
                    container
                    spacing={2}
                    sx={{
                        flexDirection: {
                            md: 'row',
                            sm: 'column-reverse',
                            xs: 'column-reverse',
                        },
                    }}>
                    <Grid
                        display="flex"
                        flexDirection="column"
                        gap={3}
                        size={{
                            md: 8,
                            sm: 12,
                            xs: 12,
                        }}>
                        <TransactionsCrud />
                    </Grid>

                    <Grid
                        size={{
                            md: 4,
                            sm: 12,
                            xs: 12,
                        }}>
                        <CashCrud />
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}
