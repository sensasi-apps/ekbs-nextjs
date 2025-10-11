import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { type ReactNode } from 'react'

interface SettingsGroupProps {
    title: string
    children: ReactNode
}

export default function SettingsGroup({ title, children }: SettingsGroupProps) {
    return (
        <Paper elevation={1} sx={{ mb: 3, p: 3 }}>
            <Typography gutterBottom variant="h6">
                {title}
            </Typography>
            <Box mt={2}>{children}</Box>
        </Paper>
    )
}
