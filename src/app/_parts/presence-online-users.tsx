'use client'

import * as Ably from 'ably'
import { useEffect, useRef } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'
import myAxios from '@/lib/axios'

export default function PresenceOnlineUsers() {
    const clientRef = useRef<Ably.Realtime | null>(null)
    const authInfo = useAuthInfo()

    useEffect(() => {
        if (
            process.env.NODE_ENV !== 'production' ||
            !authInfo ||
            clientRef.current !== null
        )
            return

        clientRef.current = new Ably.Realtime({
            authCallback: async (data, callback) => {
                myAxios
                    .post<Ably.TokenRequest>('/ably/auth', data)
                    .then(res => callback(null, res.data))
                    .catch(err => {
                        callback(err, null)
                        return
                    })
            },
        })

        const presenceChannel = clientRef.current.channels.get(
            'presence-online-users',
        )

        presenceChannel.presence.enter()
    }, [authInfo])

    return null
}
