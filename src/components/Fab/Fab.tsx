// vendors
import { type ElementType } from 'react'
// materials
import MuiFab, { type FabProps } from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
// icons
import AddIcon from '@mui/icons-material/Add'

/**
 * A floating action button component.
 * @default
 * - in: true
 * - color: success
 * - sx: { position: 'fixed', bottom: 16, right: 16 }
 * @param {FabProps} props - The props for the component.
 * @returns \@mui/material/Fab.
 */
export default function Fab({
    in: inProp = true,
    title = '',
    children,
    Icon = AddIcon,
    ...props
}: FabProps & {
    in?: boolean
    Icon?: ElementType
}) {
    return (
        <Zoom in={inProp} unmountOnExit>
            <Tooltip title={title} arrow placement="left">
                <MuiFab
                    color="success"
                    component="span"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                    {...props}>
                    {children ?? <Icon />}
                </MuiFab>
            </Tooltip>
        </Zoom>
    )
}
