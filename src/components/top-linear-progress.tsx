import LinearProgress from '@mui/material/LinearProgress'
import { Activity } from 'react'

export default function TopLinearProgress({ show }: { show: boolean }) {
    return (
        <Activity mode={show ? 'visible' : 'hidden'}>
            <LinearProgress
                color="success"
                sx={{
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: 1202, // theme.zIndex.drawer + 1
                }}
            />
        </Activity>
    )
}
