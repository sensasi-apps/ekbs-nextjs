import Tooltip from '@mui/material/Tooltip'
import type { FabProps } from '@mui/material/Fab'

import MuiFab from '@mui/material/Fab'
import Zoom from '@mui/material/Zoom'

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
    ...props
}: FabProps & {
    in?: boolean
}) {
    return (
        <Zoom in={inProp} unmountOnExit>
            <Tooltip title={title} arrow placement="left">
                <MuiFab
                    color="success"
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                    {...props}
                />
            </Tooltip>
        </Zoom>
    )
}
