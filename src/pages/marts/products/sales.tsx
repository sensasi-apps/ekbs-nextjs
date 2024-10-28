// vendors
import { Box, Unstable_Grid2 as Grid2 } from '@mui/material'
import Head from 'next/head'
// global components
import BackButton from '@/components/BackButton'
import FooterBox from '@/components/Layouts/FooterBox'
import NoInternetIndicator from '@/components/no-internet-indicator'
// page components
import AccountButton from '@/components/Layouts/components/TopBar/components/AccountButton'
import FormikWrapper from '@/components/pages/marts/products/sales/formik-wrapper'
import HistoryDatatableModalAndButton from '@/components/pages/marts/products/sales/history-datatable-modal-and-button'
import { UserAccountAlert } from '@/components/pages/marts/products/sales/user-account-alert'
// hooks
import { useRedirectIfUnauth } from '@/hooks/use-redirect-if-unauth'
import BgSyncPanelDialogAndButton from '@/components/pages/marts/products/sales/bg-sync-panel-dialog-and-button'

export default function SalesPage() {
    useRedirectIfUnauth()

    return (
        <Box
            component="main"
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

            <Top />

            <Grid2
                container
                spacing={2}
                sx={{
                    '& > *': {
                        transition: 'all 0.1s',
                    },
                }}>
                <FormikWrapper />
            </Grid2>

            <FooterBox />
        </Box>
    )
}

function Top() {
    return (
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
    )
}
