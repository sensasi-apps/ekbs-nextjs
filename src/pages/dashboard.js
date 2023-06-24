import Head from 'next/head'

import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import AppLayout from '@/components/Layouts/AppLayout'
import { useAuth } from '@/hooks/auth'

const Dashboard = () => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <AppLayout pageTitle="Dasbor">
            <Head>
                <title>{`Dasbor — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Box display="flex" gap={1}>
                <Typography variant="h5" component="span">
                    Selamat datang,
                </Typography>
                <Typography variant="h5" component="span" display="flex">
                    <span style={{ color: 'darkturquoise' }}>
                        {user?.name || (
                            <Skeleton component="span" width="5rem" />
                        )}
                    </span>
                    .
                </Typography>
            </Box>
        </AppLayout>
    )
}

export default Dashboard
