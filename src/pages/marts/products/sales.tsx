// vendors
import { useState } from 'react'
import { Alert, Box, Button, Fade, Typography } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2'
import Head from 'next/head'
// icons
import HistoryIcon from '@mui/icons-material/History'
// components
import BackButton from '@/components/BackButton'
import FooterBox from '@/components/Layouts/FooterBox'
import AccountButton from '@/components/Layouts/components/TopBar/components/AccountButton'
// locals
import SaleList from '@/components/pages/marts/products/sales/SaleList'
// utils
import blinkSxValue from '@/utils/blinkSxValue'
import FormikComponent from '@/components/pages/marts/products/sales/FormikComponent'

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

                <FormikComponent />
            </Grid2>

            <FooterBox />
        </Box>
    )
}

function Top() {
    const [showWarning, setShowWarning] = useState(true)

    return (
        <Box
            my={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center">
            <BackButton />

            <Fade in={showWarning} unmountOnExit>
                <Alert
                    severity="warning"
                    variant="outlined"
                    onClose={() => setShowWarning(false)}
                    sx={{
                        mx: 4,
                    }}>
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

            <Box>
                <AccountButton color="success" />
            </Box>
        </Box>
    )
}
