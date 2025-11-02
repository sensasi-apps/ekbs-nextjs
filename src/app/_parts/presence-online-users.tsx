'use client'

import * as Ably from 'ably'
import { useEffect } from 'react'
import useAuthInfo from '@/hooks/use-auth-info'
import myAxios from '@/lib/axios'

export default function PresenceOnlineUsers() {
    const authInfo = useAuthInfo()

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || !authInfo) {
            return
        }

        const ably = new Ably.Realtime({
            authCallback: async (data, callback) => {
                myAxios
                    .post<Ably.TokenRequest>('/ably/auth', data)
                    .then(res => callback(null, res.data))
                    .catch(err => {
                        callback(err, null)
                        return
                    })
            },
            clientId: authInfo.uuid,
            recover: (_, callback) => {
                callback(true)
            },
        })

        const presenceChannel = ably.channels.get('presence-online-users')

        presenceChannel.presence.enter()
    }, [authInfo])

    return null
}
