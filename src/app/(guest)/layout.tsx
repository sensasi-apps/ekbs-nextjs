import type { ReactNode } from 'react'
// materials
import { ThemeProvider } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
// components
import FlatFooter from '@/app/_parts/flat-footer'
// parts
import THEME from '@/app/(guest)/_parts/THEME'

const BG_IMG_URL =
    'https://belayansejahtera.org/wp-content/uploads/2025/02/FJR00081-scaled-e1755241368530.jpg'

/**
 * A layout component that provides a background image with a darkened overlay.
 *
 * It contains a main section with a fade in animation and a footer section.
 */
export default function Layout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={THEME}>
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
                    {children}
                </Container>

                <Container maxWidth="lg">
                    <FlatFooter />
                </Container>
            </Box>
        </ThemeProvider>
    )
}
