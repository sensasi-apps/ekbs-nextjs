// vendors

// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Head from 'next/head'
import BgSyncPanelDialogAndButton from '@/app/mart-product-sales/_parts/bg-sync-panel-dialog-and-button'
// global components
import AccountButton from '@/components/account-button'
import BackButton from '@/components/back-button'
import NoInternetIndicator from '@/components/no-internet-indicator'
// page components
import FormikWrapper from '@/components/pages/marts/products/sales/formik-wrapper'
import HistoryDatatableModalAndButton from '@/components/pages/marts/products/sales/history-datatable-modal-and-button'
// hooks
import { UserAccountAlert } from '@/components/pages/marts/products/sales/user-account-alert'

export default function SalesPage() {
    return (
        <>
            <Head>
                <title>{`Kasir Belayan Mart — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                my={2}>
                <Box alignItems="center" display="flex" gap={1}>
                    <BackButton />

                    <HistoryDatatableModalAndButton />

                    <BgSyncPanelDialogAndButton />
                </Box>

                <UserAccountAlert />

                <Box alignItems="center" display="flex" gap={1}>
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
