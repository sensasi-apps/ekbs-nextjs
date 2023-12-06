import type { FadeProps } from '@mui/material/Fade'
// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'

/**
 * A component that displays a loading bar inside a dialog.
 * @param style - Default: {
        position: 'absolute',
        width: '100%',
        transform: 'translate(-24px, -64px)',
    }
 * @param props - The additional props to pass to the component.
 * @bug only works with absolute positioned dialogs.
 */
export default function DialogLoadingBar({
    style = {},
    ...props
}: Omit<FadeProps, 'children'>) {
    const {
        position = 'absolute',
        width = '100%',
        transform = 'translate(-1.5em, -4em)',
        ...restStyle
    } = style

    return (
        <Fade
            style={{
                position,
                width,
                transform,
                ...restStyle,
            }}
            {...props}>
            <LinearProgress />
        </Fade>
    )
}
