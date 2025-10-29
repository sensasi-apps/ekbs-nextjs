import Grid from '@mui/material/Grid'
import type { Metadata } from 'next'
import FlexBox from '@/components/flex-box'
import AlertListCard from '@/components/pages/dashboard/AlertListCard'
import { Cards } from './cards'
import Greeting from './greetings'
import TempCards from './temp-cards'

export default function Page() {
    return (
        <>
            <Greeting />

            <FlexBox
                alignItems="flex-start"
                gap={2}
                mt={8}
                sx={{
                    '> *': {
                        flexBasis: {
                            md: '32%',
                            xs: '100%',
                        },
                        height: '100%',
                    },
                    flexFlow: 'row wrap',
                }}>
                <TempCards />
                <Cards />
            </FlexBox>

            <Grid container spacing={2}>
                <Grid size={{ md: 4, xs: 12 }}>
                    <AlertListCard />
                </Grid>
            </Grid>
        </>
    )
}

export const metadata: Metadata = {
    title: `Dasbor — ${process.env.NEXT_PUBLIC_APP_NAME}`,
}
