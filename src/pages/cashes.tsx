// materials
import Grid from '@mui/material/Grid'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import CashCrud from '@/components/Cash/Crud'
import TransactionsCrud from '@/components/Transaction/Crud'

export default function Cashses() {
    return (
        <AuthLayout title="Kas">
            <Grid
                container
                spacing={3}
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

                <CashCrud wrapper={Grid} item xs={12} sm={12} md={4} />
            </Grid>
        </AuthLayout>
    )
}
