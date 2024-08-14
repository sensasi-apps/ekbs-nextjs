import type { CssVarsTheme, Theme } from '@mui/material/styles'
import type { LinkProps } from 'next/link'

import { forwardRef } from 'react'
import { experimental_extendTheme as extendTheme } from '@mui/material'

import Link from 'next/link'

let THEME: (Omit<Theme, 'palette'> & CssVarsTheme) | undefined = undefined

const LinkBehaviour = forwardRef<HTMLAnchorElement, LinkProps>(
    function LinkBehaviour(props, ref) {
        return <Link {...props} ref={ref} />
    },
)

export default function getTheme() {
    if (!THEME)
        THEME = extendTheme({
            colorSchemes: {
                light: {
                    palette: {
                        background: {
                            default: '#f8f7f4',
                        },
                    },
                },
            },
            components: {
                MuiLink: {
                    defaultProps: {
                        component: LinkBehaviour,
                    },
                },
                MuiButtonBase: {
                    defaultProps: {
                        LinkComponent: LinkBehaviour,
                    },
                },
            },
        })

    return THEME
}
