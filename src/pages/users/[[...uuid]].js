import { useRouter } from 'next/router'

import Head from 'next/head'

import Grid from '@mui/material/Grid'

import AppLayout from '@/components/Layouts/AppLayout'
import Summary from '@/components/User/Summary'
import UserCards from '@/components/User/Cards'
import UserSelect from '@/components/User/Select'

export default function users() {
    const router = useRouter()

    const userSelectOnChange = async (e, value) => {
        if (!value) return

        router.push(`/users/${value.uuid}`)
    }

    return (
        <AppLayout pageTitle="Pengguna">
            <Head>
                <title>{`Pengguna — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

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
                    sm={12}
                    md={8}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={3}>
                    <UserSelect onChange={userSelectOnChange} />
                    <UserCards />
                </Grid>

                <Grid item sm={12} md={4} width="100%">
                    <Summary />
                </Grid>
            </Grid>
        </AppLayout>
    )
}
