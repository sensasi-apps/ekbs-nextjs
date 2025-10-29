import LinearProgress from '@mui/material/LinearProgress'

export default function TopLoadingBar() {
    return (
        <LinearProgress
            color="success"
            sx={{
                left: 0,
                position: 'fixed',
                right: 0,
                top: 0,
                zIndex: 1202, // theme.zIndex.drawer + 1
            }}
        />
    )
}
