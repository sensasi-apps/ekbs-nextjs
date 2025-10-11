import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
// materials
import { ThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'
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
                    backgroundAttachment: 'fixed',
                    backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6) ), url(${BG_IMG_URL})`,

                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                    color: 'grey.500',
                    display: 'flex',
                    flexDirection: 'column',

                    gap: 10,
                    justifyContent: 'space-between',

                    minHeight: '100svh',

                    p: 4,
                    pb: 4,
                }}>
                <Container
                    component="main"
                    maxWidth="lg"
                    sx={{
                        alignItems: 'center',

                        display: 'flex',
                        flexGrow: 1,
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
