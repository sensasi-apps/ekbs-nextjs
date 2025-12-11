import Add from '@mui/icons-material/Add'

import Fab from '@/components/fab'
import NextLink from '@/components/next-link'
import PageTitle from '@/components/page-title'
import PageClient from './page-client'

export default function Page() {
    return (
        <>
            <PageTitle title="Laporan Isu" />

            <PageClient />

            <Fab component={NextLink} href="issues/create">
                <Add />
            </Fab>
        </>
    )
}

export const metadata = {
    title: 'Laporan Isu',
}
