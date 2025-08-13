'use client'

import MAIN_THEME from '@/providers/@statics/theme'
import { createTheme, THEME_ID } from '@mui/material/styles'

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
    components: MAIN_THEME.components,
})

const THEME = { [THEME_ID]: PAGE_THEME }

export default THEME
