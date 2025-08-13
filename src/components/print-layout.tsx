import type { ReactNode } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'

const lightTheme = createTheme()

export default function PrintLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider theme={lightTheme}>
            <main>{children}</main>
        </ThemeProvider>
    )
}
