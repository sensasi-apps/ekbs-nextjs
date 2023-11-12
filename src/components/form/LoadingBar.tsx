import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'

export default function FormLoadingBar(props: { in: boolean }) {
    return (
        <Fade
            in={props.in}
            style={{
                position: 'absolute',
                width: '100%',
                transform: 'translate(-24px, -64px)',
            }}>
            <LinearProgress />
        </Fade>
    )
}
