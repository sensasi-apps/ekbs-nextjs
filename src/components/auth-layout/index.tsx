// types

// materials
import Box from '@mui/material/Box'
import { type ReactNode } from 'react'
// components
import ContentGuard from '@/components/content-guard'
import RedirectIfUnauth from '@/components/redirect-if-unauth'
import The401Protection from '@/components/the-401-protection'
// parts
import FooterBox from '../footer-box'
import NavBar from './_parts/nav-bar'
import WIDTH from './_parts/nav-bar/WIDTH'
import TopBar from './_parts/top-bar'
import PresenceOnlineUsers from './presence-online-users'

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div
            style={{
                display: 'flex',
            }}>
            <RedirectIfUnauth />

            <The401Protection />

            <PresenceOnlineUsers />

            <NavBar />

            <Box
                flexGrow="1"
                width={{
                    sm: `calc(100% - ${WIDTH}px)`,
                    xs: '100%',
                }}>
                <TopBar />

                <Box
                    component="main"
                    sx={{
                        p: {
                            sm: 6,
                            xs: 3,
                        },
                    }}>
                    <ContentGuard>{children}</ContentGuard>
                </Box>

                <FooterBox mb={6} mt={10} />
            </Box>
        </div>
    )
}
