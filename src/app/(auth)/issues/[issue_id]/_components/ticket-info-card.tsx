'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Typography from '@mui/material/Typography'
import UserDisplay from '@/components/user-display'
import toDmy from '@/utils/to-dmy'
import type TicketORM from '../../_types/orms/ticket'

const PRIORITY_CONFIG = {
    high: { color: 'error' as const, label: 'Tinggi' },
    low: { color: 'info' as const, label: 'Rendah' },
    medium: { color: 'warning' as const, label: 'Sedang' },
}

const STATUS_CONFIG = {
    closed: { color: 'default' as const, label: 'Ditutup' },
    open: { color: 'success' as const, label: 'Terbuka' },
}

export default function TicketInfoCard({ ticket }: { ticket: TicketORM }) {
    const priorityConfig = PRIORITY_CONFIG[ticket.priority]
    const statusConfig = STATUS_CONFIG[ticket.status]

    return (
        <Card variant="outlined">
            <CardContent>
                <Box
                    alignItems="start"
                    display="flex"
                    justifyContent="space-between"
                    mb={2}>
                    <Box>
                        <Typography color="text.secondary" variant="caption">
                            Tiket #{ticket.id}
                        </Typography>
                        <Typography component="h1" variant="h5">
                            {ticket.title}
                        </Typography>
                        <Typography
                            color="text.secondary"
                            gutterBottom
                            variant="body2">
                            {toDmy(ticket.created_at)}
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1}>
                        <Chip
                            color={priorityConfig.color}
                            label={priorityConfig.label}
                            size="small"
                        />
                        <Chip
                            color={statusConfig.color}
                            label={statusConfig.label}
                            size="small"
                            variant="outlined"
                        />
                    </Box>
                </Box>

                <Box mb={2}>
                    <Typography
                        color="text.secondary"
                        gutterBottom
                        variant="body2">
                        Dibuat oleh:
                    </Typography>
                    {ticket.user && <UserDisplay data={ticket.user} />}
                </Box>

                <Box mb={2}>
                    {ticket.updated_at !== ticket.created_at && (
                        <Typography color="text.secondary" variant="body2">
                            Diperbarui: {toDmy(ticket.updated_at)}
                        </Typography>
                    )}
                </Box>

                <Box>
                    <Typography
                        color="text.secondary"
                        gutterBottom
                        variant="body2">
                        Pesan:
                    </Typography>
                    <Typography
                        sx={{
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                        }}
                        variant="body1">
                        {ticket.message}
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
