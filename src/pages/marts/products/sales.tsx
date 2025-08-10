// vendors
import Head from 'next/head'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// global components
import BackButton from '@/components/BackButton'
import FooterBox from '@/components/Layouts/FooterBox'
import NoInternetIndicator from '@/components/no-internet-indicator'
// page components
import AccountButton from '@/components/Layouts/_parts/TopBar/components/AccountButton'
import FormikWrapper from '@/components/pages/marts/products/sales/formik-wrapper'
import HistoryDatatableModalAndButton from '@/components/pages/marts/products/sales/history-datatable-modal-and-button'
// hooks
import { useRedirectIfUnauth } from '@/hooks/use-redirect-if-unauth'
import { UserAccountAlert } from '@/components/pages/marts/products/sales/user-account-alert'
import BgSyncPanelDialogAndButton from '@/components/pages/marts/products/sales/bg-sync-panel-dialog-and-button'
import { The401Protection } from '@/components/Layouts/auth-layout.401-protection'

export default function SalesPage() {
    useRedirectIfUnauth()

    return (
        <Box
            px={2}
            sx={{
                userSelect: 'none',
                msUserSelect: 'none',
                webkitUserSelect: 'none',
                mozUserSelect: 'none',
            }}>
            <Head>
                <title>{`Kasir Belayan Mart — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <The401Protection />

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

            <FooterBox />
        </Box>
    )
}
