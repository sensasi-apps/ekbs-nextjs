'use client'

import Echo from '@ably/laravel-echo'
import * as Ably from 'ably'
import { useEffect } from 'react'
import myAxios from '@/lib/axios'

const ECHO_OPTIONS = {
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL}/broadcasting/auth`,
    broadcaster: 'ably',
    requestTokenFn:
        process.env.NODE_ENV === 'production'
            ? undefined
            : async (channelName: string, existingToken: string) => {
                  const postData = {
                      channel_name: channelName,
                      token: existingToken,
                  }
                  const res = await myAxios.post<{ token: string }>(
                      '/../broadcasting/auth',
                      postData,
                  )

                  return res.data
              },
    useTls: process.env.NODE_ENV === 'production',
}

export default function EchoJoin({ channel }: { channel: string }) {
    useEffect(() => {
        if (typeof window === 'undefined') return

        if (!window.Ably) {
            window.Ably = Ably
        }

        if (!window.Echo) {
            window.Echo = new Echo(ECHO_OPTIONS)
        }

        const echo = window.Echo

        const ably = echo.connector.ably as Ably.Realtime

        ably.connection.on('connected', () => {
            echo.join(channel)
        })

        return () => {
            echo.leaveChannel(`presence:${channel}`)
        }
    }, [channel])

    return null
}
