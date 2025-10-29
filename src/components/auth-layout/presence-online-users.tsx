'use client'

import * as Ably from 'ably'
import { useEffect } from 'react'
import myAxios from '@/lib/axios'

const client =
    process.env.NODE_ENV === 'production'
        ? new Ably.Realtime({
              authCallback: async (data, callback) => {
                  myAxios
                      .post<Ably.TokenRequest>('/ably/auth', data)
                      .then(res => callback(null, res.data))
                      .catch(err => {
                          callback(err, null)
                          return
                      })
              },
              tls: true,
          })
        : null

export default function PresenceOnlineUsers() {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production' || !client) return

        const presenceChannel = client.channels.get('presence-online-users')

        presenceChannel.presence.enter()

        return () => {
            presenceChannel.presence.leave()
        }
    }, [])

    return null
}
