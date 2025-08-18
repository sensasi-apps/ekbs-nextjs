// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// global components
import AccountButton from '@/components/account-button'
import BackButton from '@/components/back-button'
import NoInternetIndicator from '@/components/no-internet-indicator'
// page components
import FormikWrapper from '@/components/pages/marts/products/sales/formik-wrapper'
import HistoryDatatableModalAndButton from '@/components/pages/marts/products/sales/history-datatable-modal-and-button'
// hooks
import { UserAccountAlert } from '@/components/pages/marts/products/sales/user-account-alert'
import BgSyncPanelDialogAndButton from '@/app/mart-product-sales/_parts/bg-sync-panel-dialog-and-button'

export default function SalesPage() {
    return (
        <>
            <Head>
                <title>{`Kasir Belayan Mart — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Box
                my={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center">
                <Box display="flex" gap={1} alignItems="center">
                    <BackButton />

                    <HistoryDatatableModalAndButton />

                    <BgSyncPanelDialogAndButton />
                </Box>

                <UserAccountAlert />

                <Box display="flex" alignItems="center" gap={1}>
                    <AccountButton color="success" />
                    <NoInternetIndicator />
                </Box>
            </Box>

            <Grid
                component="main"
                container
                spacing={2}
                sx={{
                    '& > *': {
                        transition: 'all 0.1s',
                    },
                }}>
                <FormikWrapper />
            </Grid>
        </>
    )
}
