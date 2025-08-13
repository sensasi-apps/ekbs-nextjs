'use client'

import type { ReactNode } from 'react'
// materials
import { createTheme, THEME_ID, ThemeProvider } from '@mui/material/styles'
import Box, { type BoxProps } from '@mui/material/Box'
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
//
import Footer from '@/components/Layouts/_parts/footer'
import THEME from '@/providers/@statics/theme'

const LIGHT = createTheme({
    palette: {
        mode: 'light',
    },
})

const PAGE_THEME = createTheme({
    palette: {
        mode: 'dark',
        primary: LIGHT.palette.primary,
        success: LIGHT.palette.success,
        warning: LIGHT.palette.warning,
        error: LIGHT.palette.error,
    },
    components: THEME.components,
})

const BG_IMG_URL =
    'https://belayansejahtera.org/wp-content/uploads/2025/02/FJR00081-scaled.jpg'

/**
 * A layout component that provides a background image with a darkened overlay.
 *
 * It contains a main section with a fade in animation and a footer section.
 */
export default function LayoutWithImageBackground({
    children,
    slotProps,
}: {
    children: ReactNode

    slotProps?: {
        wrapperBox?: BoxProps
    }
}) {
    return (
        <ThemeProvider theme={{ [THEME_ID]: PAGE_THEME }}>
            <Box
                sx={{
                    color: 'grey.500',

                    minHeight: '100svh',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',

                    gap: 10,

                    p: 4,
                    pb: 4,

                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(${BG_IMG_URL})`,
                }}>
                <Container
                    maxWidth="lg"
                    component="main"
                    sx={{
                        flexGrow: 1,

                        display: 'flex',
                        alignItems: 'center',
                    }}>
                    <Fade
                        in
                        timeout={{
                            enter: 1000,
                        }}>
                        <Box {...slotProps?.wrapperBox}>{children}</Box>
                    </Fade>
                </Container>

                <Container maxWidth="lg">
                    <Footer />
                </Container>
            </Box>
        </ThemeProvider>
    )
}
