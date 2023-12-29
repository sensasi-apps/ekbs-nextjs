// types
import type { ReactNode } from 'react'
//vendors
import Head from 'next/head'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Container from '@mui/material/Container'
import FooterBox from '@/components/Layouts/FooterBox'
// icons
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FooterBoxWithLogo from './FooterBox/WithLogo'

const DarkModeToggle = dynamic(() => import('@/components/DarkModeToggle'), {
    ssr: false,
})

export default function PublicLayout({
    children,
    title,
    backButton = false,
    loginButton = false,
    footerTextOnly = false,
}: {
    title: string
    children: ReactNode
    backButton?: boolean
    loginButton?: boolean
    footerTextOnly?: boolean
}) {
    const { back, push } = useRouter()

    return (
        <Container
            maxWidth="md"
            sx={{
                my: 2,
            }}>
            <Head>
                <title>{title}</title>
            </Head>

            {(backButton || loginButton) && (
                <Box
                    display="flex"
                    justifyContent={
                        backButton && loginButton
                            ? 'space-between'
                            : loginButton
                              ? 'flex-end'
                              : undefined
                    }>
                    {backButton && (
                        <Button
                            startIcon={<ArrowBackIcon />}
                            sx={{
                                alignSelf: 'flex-end',
                            }}
                            onClick={() =>
                                history.length === 1 ? push('/') : back()
                            }>
                            Kembali
                        </Button>
                    )}

                    {loginButton && (
                        <Button
                            href="dashboard"
                            endIcon={<ArrowForwardIcon />}
                            sx={{
                                alignSelf: 'flex-end',
                            }}>
                            Masuk
                        </Button>
                    )}
                </Box>
            )}

            <main>{children}</main>

            {footerTextOnly ? <FooterBox /> : <FooterBoxWithLogo />}
            <DarkModeToggle />
        </Container>
    )
}
