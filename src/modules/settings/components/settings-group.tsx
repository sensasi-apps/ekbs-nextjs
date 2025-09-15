import { type ReactNode } from 'react'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

interface SettingsGroupProps {
    title: string
    children: ReactNode
}

export default function SettingsGroup({ title, children }: SettingsGroupProps) {
    return (
        <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Box mt={2}>{children}</Box>
        </Paper>
    )
}
