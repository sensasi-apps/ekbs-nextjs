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
                        xs: 0,
                        md: 3,
                    }}></Grid>
                <Grid
                    size={{
                        xs: 12,
                        md: 9,
                    }}>
                    {children}
                </Grid>
            </Grid>
        </Box>
    )
}
