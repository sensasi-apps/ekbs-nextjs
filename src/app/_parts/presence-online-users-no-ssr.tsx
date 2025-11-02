'use client'

import dynamic from 'next/dynamic'

const PresenceOnlineUsers = dynamic(() => import('./presence-online-users'), {
    ssr: false,
})

export default function PresenceOnlineUsersNoSSR() {
    return <PresenceOnlineUsers />
}
