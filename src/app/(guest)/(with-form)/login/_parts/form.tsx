// materials
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import TextField from '@mui/material/TextField'
// components
import Link from '@/components/link'

export default function LoginForm({
    handleSubmit,
}: {
    handleSubmit: HTMLFormElement['onSubmit']
}) {
    return (
        <Box component="form" onSubmit={handleSubmit} autoComplete="off">
            <TextField
                margin="normal"
                required
                inputProps={{
                    autoComplete: 'off',
                }}
                fullWidth
                id="email"
                label="Email Address"
                type="email"
                name="email"
            />

            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
            />

            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mt: 3, mb: 2 }}>
                <Fab
                    variant="extended"
                    color="success"
                    type="submit"
                    sx={{
                        px: 3,
                    }}>
                    Masuk
                </Fab>

                <Link href="/forgot-password" variant="body2" color="info">
                    Lupa kata sandi?
                </Link>
            </Box>
        </Box>
    )
}
