// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import CashCrud from '@/components/pages/cashes/Cash/Crud'
import TransactionsCrud from '@/components/pages/cashes/Transaction/Crud'
import InOutCashChart from '@/components/pages/cashes/Cash/InOutChart'
import AllCashChart from '@/components/pages/cashes/Cash/AllCashChart'

export default function Cashses() {
    return (
        <AuthLayout title="Kas">
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
                        item
                        xs={12}
                        sm={12}
                        md={8}
                        display="flex"
                        flexDirection="column"
                        gap={3}>
                        <TransactionsCrud />
                    </Grid>

                    <Grid item xs={12} sm={12} md={4}>
                        <CashCrud />
                    </Grid>
                </Grid>
            </Box>
        </AuthLayout>
    )
}
