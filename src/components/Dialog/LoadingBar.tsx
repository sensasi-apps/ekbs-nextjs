import Fade, { FadeProps } from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'

/**
 * A component that displays a loading bar inside a dialog.
 * @param style - Default: {
        position: 'absolute',
        width: '100%',
        transform: 'translate(-24px, -64px)',
    }
 * @param props - The additional props to pass to the component.
 */
export default function DialogLoadingBar({
    style = {
        position: 'absolute',
        width: '100%',
        transform: 'translate(-24px, -64px)',
    },
    ...props
}: Omit<FadeProps, 'children'>) {
    return (
        <Fade style={style} {...props}>
            <LinearProgress />
        </Fade>
    )
}
