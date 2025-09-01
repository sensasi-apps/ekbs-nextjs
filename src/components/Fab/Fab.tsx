// materials
import MuiFab, { type FabProps } from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import Zoom from '@mui/material/Zoom'
// icons
import AddIcon from '@mui/icons-material/Add'

/**
 * A floating action button component.
 *
 * @default
 * - in: true
 * - color: success
 * - sx: { position: 'fixed', bottom: 32, right: 32 }
 * - Icon: AddIcon
 */
export default function Fab({
    in: inProp = true,
    title = 'Tambah',
    children,
    Icon = AddIcon,
    ...props
}: FabProps & {
    in?: boolean
    Icon?: typeof AddIcon
}) {
    return (
        <Zoom in={inProp} unmountOnExit>
            <Tooltip title={title} arrow placement="left">
                <MuiFab
                    color="success"
                    component="span"
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                    }}
                    {...props}>
                    {children ?? <Icon />}
                </MuiFab>
            </Tooltip>
        </Zoom>
    )
}
