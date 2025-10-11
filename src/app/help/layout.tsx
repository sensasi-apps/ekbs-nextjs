// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
// components
import AccountButton from '@/components/account-button'

export default function HelpLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Box p={4}>
            <Box display="flex" justifyContent="end">
                <AccountButton />
            </Box>

            <Grid container spacing={4}>
                <Grid
                    size={{
                        md: 3,
                        xs: 0,
                    }}></Grid>
                <Grid
                    size={{
                        md: 9,
                        xs: 12,
                    }}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    )
}
