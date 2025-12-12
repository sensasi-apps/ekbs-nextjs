'use client'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import { Activity, useCallback, useEffect, useRef } from 'react'
import toDmy from '@/utils/to-dmy'
import type MessageORM from '../../_types/orms/message'

export default function MessagesThread({
    messages,
    currentUserUuid,
}: {
    messages: MessageORM[]
    currentUserUuid?: string
}) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [scrollToBottom])

    if (!messages || messages.length === 0) {
        return (
            <Box
                alignItems="center"
                display="flex"
                justifyContent="center"
                minHeight="200px">
                <Typography color="text.secondary" variant="body2">
                    Belum ada balasan. Jadilah yang pertama untuk membalas!
                </Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxHeight: '500px',
                overflowY: 'auto',
            }}>
            {messages.map(message => {
                const isCurrentUser = message.by_user_uuid === currentUserUuid

                return (
                    <Box display="flex" gap={2} key={message.id}>
                        <Activity mode={isCurrentUser ? 'hidden' : 'visible'}>
                            <Avatar
                                alt={message.user?.name}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    height: 40,
                                    width: 40,
                                }}>
                                {message.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Activity>

                        <Card sx={{ flexGrow: 1 }} variant="outlined">
                            <CardContent>
                                <Box
                                    sx={{
                                        fontWeight: 'bold',
                                        // mb: 2,
                                    }}>
                                    {message.user?.name}
                                    <Typography
                                        color="text.secondary"
                                        component="span"
                                        ml={1}
                                        variant="body2">
                                        berkomentar pada{' '}
                                        {toDmy(message.created_at)}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Typography
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-word',
                                    }}
                                    variant="body2">
                                    {message.message}
                                </Typography>
                            </CardContent>
                        </Card>

                        <Activity mode={isCurrentUser ? 'visible' : 'hidden'}>
                            <Avatar
                                alt={message.user?.name}
                                sx={{
                                    border: 1,
                                    borderColor: 'divider',
                                    height: 40,
                                    width: 40,
                                }}>
                                {message.user?.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </Activity>
                    </Box>
                )
            })}
            <div ref={messagesEndRef} />
        </Box>
    )
}
