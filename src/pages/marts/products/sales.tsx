// vendors
import { Box } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
// components
import BackButton from '@/components/BackButton'
import FooterBox from '@/components/Layouts/FooterBox'
import AccountButton from '@/components/Layouts/components/TopBar/components/AccountButton'
// utils
import FormikComponent from '@/components/pages/marts/products/sales/FormikComponent'
import HistoryDatatableModalAndButton from '@/components/pages/marts/products/sales/HistoryDatatableModalAndButton'
import UserAccountAlert from '@/components/pages/marts/products/sales/UserAccountAlert'
import { useRedirectIfUnauth } from '@/hooks/use-redirect-if-unauth'
import NoInternetIndicator from '@/components/no-internet-indicator'

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
                <FormikComponent />
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
            <Box display="flex" gap={2}>
                <BackButton />
                <HistoryDatatableModalAndButton />
            </Box>

            <UserAccountAlert />

            <Box display="flex" alignItems="center" gap={1}>
                <AccountButton color="success" />
                <NoInternetIndicator />
            </Box>
        </Box>
    )
}
