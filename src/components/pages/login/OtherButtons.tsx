// materials
import Button from '@mui/material/Button'
// icons
// import GoogleIcon from '@mui/icons-material/Google'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export function OtherButtons() {
    return (
        <>
            {/* disable google login for now due to offline auth */}
            {/* <Button
                href="/api/oauth/google"
                fullWidth
                color="inherit"
                variant="contained"
                startIcon={<GoogleIcon />}>
                Login dengan Google
            </Button> */}

            <Button
                href="/"
                fullWidth
                color="inherit"
                startIcon={<ArrowBackIcon />}>
                Kembali ke halaman depan
            </Button>
        </>
    )
}
