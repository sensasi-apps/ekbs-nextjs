'use client'

import { createTheme, THEME_ID } from '@mui/material/styles'
import MAIN_THEME from '@/providers/@statics/theme'

const LIGHT = createTheme({
    palette: {
        mode: 'light',
    },
})

const PAGE_THEME = createTheme({
    components: MAIN_THEME.components,
    palette: {
        error: LIGHT.palette.error,
        mode: 'dark',
        primary: LIGHT.palette.primary,
        success: LIGHT.palette.success,
        warning: LIGHT.palette.warning,
    },
})

const THEME = { [THEME_ID]: PAGE_THEME }

export default THEME
