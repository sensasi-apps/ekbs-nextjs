'use client'

// icons
import AddIcon from '@mui/icons-material/Add'
// materials
import MuiFab, { type FabProps } from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
// components
import NextLink from '@/components/next-link'

/**
 * A floating action button component.
 */
export default function Fab({
    in: inProp = true,
    color = 'success',
    title = 'Tambah',
    sx = {},
    children,
    Icon = AddIcon,
    ...props
}: FabProps & {
    /**
     * @default 'success'
     */
    color?: FabProps['color']

    /**
     * @default true
     */
    in?: boolean

    /**
     * @default
     * - position: 'fixed'
     * - bottom: 32
     * - right: 32
     */
    sx?: FabProps['sx']

    /**
     * @default 'Tambah'
     */
    title?: string

    /**
     * @default AddIcon
     */
    Icon?: typeof AddIcon
}) {
    const fabComponent = props.href ? NextLink : undefined

    return (
        <Zoom in={inProp}>
            <Tooltip arrow placement="left" title={title}>
                <MuiFab
                    color={color}
                    component={fabComponent}
                    sx={{ ...DEFAULT_SX, ...sx }}
                    {...props}>
                    {children ?? <Icon />}
                </MuiFab>
            </Tooltip>
        </Zoom>
    )
}

const DEFAULT_SX = {
    bottom: 32,
    position: 'fixed',
    right: 32,
} as const
