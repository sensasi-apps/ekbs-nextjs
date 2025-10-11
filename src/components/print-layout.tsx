import { createTheme, ThemeProvider } from '@mui/material/styles'
import type { ReactNode } from 'react'

const lightTheme = createTheme()

export default function PrintLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={lightTheme}>
            <main>{children}</main>
        </ThemeProvider>
    )
}
