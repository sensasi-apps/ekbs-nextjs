'use client'

import * as Ably from 'ably'
import { useEffect } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'
import myAxios from '@/lib/axios'

export default function PresenceOnlineUsers() {
    const authInfo = useAuthInfo()

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || !authInfo) return

        const client = new Ably.Realtime({
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

        const presenceChannel = client.channels.get('presence-online-users')

        presenceChannel.presence.enter()

        return () => {
            presenceChannel.presence.leave()
        }
    }, [authInfo])

    return null
}
