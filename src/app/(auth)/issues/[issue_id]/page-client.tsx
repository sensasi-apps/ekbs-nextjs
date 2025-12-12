'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import type TicketORM from '../_types/orms/ticket'
import MessagesThread from './_components/messages-thread'
import ReplyForm from './_components/reply-form'
import TicketInfoCard from './_components/ticket-info-card'

export default function PageClient() {
    const params = useParams()
    const issueId = params?.issue_id as string

    const {
        data: ticket,
        error,
        mutate,
        isLoading,
    } = useSWR<TicketORM>(issueId ? `/issues/tickets/${issueId}` : null)

    const handleMessageSent = () => {
        mutate()
    }

    if (isLoading) {
        return (
            <Box
                alignItems="center"
                display="flex"
                justifyContent="center"
                minHeight="400px">
                <CircularProgress />
            </Box>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography align="center" color="error">
                        Gagal memuat data tiket. Silakan coba lagi.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    if (!ticket) {
        return (
            <Card>
                <CardContent>
                    <Typography align="center" color="text.secondary">
                        Tiket tidak ditemukan.
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <TicketInfoCard ticket={ticket} />

            <MessagesThread
                currentUserUuid={ticket.user?.uuid}
                messages={ticket.messages || []}
            />

            <ReplyForm onMessageSent={handleMessageSent} ticketId={ticket.id} />
        </Box>
    )
}
