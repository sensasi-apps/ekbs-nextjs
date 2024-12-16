// types
import type { ReactNode } from 'react'

// components
import {
    Box,
    type BoxProps,
    Container,
    createTheme,
    Fade,
    THEME_ID,
    ThemeProvider,
} from '@mui/material'
import { Footer } from '@/components/Layouts/components/footer'
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

export function Background({
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
                    backgroundImage:
                        'linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(https://belayansejahtera.org/wp-content/uploads/2024/10/FJR05684-2-scaled.jpg)',
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
