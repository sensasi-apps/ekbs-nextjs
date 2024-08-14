import { useState } from 'react'
import BackButton from '@/components/BackButton'
import { Alert, Box, Button, Fade, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
import ProductPicker from '@/components/pages/marts/products/sales/ProductPicker'
import SaleList from '@/components/pages/marts/products/sales/SaleList'
import AccountButton from '@/components/Layouts/components/TopBar/components/AccountButton'
import ReceiptPreview from '@/components/pages/marts/products/sales/ReceiptPreview'
import HistoryIcon from '@mui/icons-material/History'
import FooterBox from '@/components/Layouts/FooterBox'
import blinkSxValue from '@/utils/blinkSxValue'

export default function SalesPage() {
    const [showList, setShowList] = useState(false)

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

            <Box mb={2}>
                <Button
                    startIcon={<HistoryIcon />}
                    size="small"
                    variant={showList ? 'contained' : 'outlined'}
                    onClick={() => setShowList(prev => !prev)}>
                    Lihat Riwayat
                </Button>
            </Box>

            <Grid2
                container
                spacing={2}
                sx={{
                    '& > *': {
                        transition: 'all 0.1s',
                    },
                }}>
                <Grid2
                    xs={showList ? 2.5 : 0}
                    sx={{
                        opacity: showList ? 1 : 0,
                        p: showList ? undefined : 0,
                        maxHeight: showList ? undefined : 0,
                        overflow: 'hidden',
                    }}>
                    <SaleList />
                </Grid2>

                <Grid2 xs={12} md={showList ? 6 : 8}>
                    <ProductPicker />
                </Grid2>

                <Grid2 xs={12} md={showList ? 3.5 : 4}>
                    <ReceiptPreview />
                </Grid2>
            </Grid2>

            <FooterBox />
        </Box>
    )
}

function Top() {
    const [showWarning, setShowWarning] = useState(true)

    return (
        <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <BackButton />

            <Fade in={showWarning} unmountOnExit>
                <Alert
                    severity="warning"
                    variant="outlined"
                    onClose={() => setShowWarning(false)}>
                    <Typography
                        component="div"
                        variant="caption"
                        fontWeight="bold"
                        sx={blinkSxValue}>
                        Peringatan
                    </Typography>

                    <Typography variant="caption">
                        Pastikan nama akun yang tertera telah sesuai dengan nama
                        Anda
                    </Typography>
                </Alert>
            </Fade>

            <AccountButton />
        </Box>
    )
}
