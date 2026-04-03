// materials
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'

export default function LoginForm({
    handleSubmit,
}: {
    handleSubmit: HTMLFormElement['onSubmit']
}) {
    return (
        <Box autoComplete="off" component="form" onSubmit={handleSubmit}>
            <TextField
                fullWidth
                id="email"
                inputProps={{
                    autoComplete: 'off',
                }}
                label="Email Address"
                margin="normal"
                name="email"
                required
                type="email"
            />

            <TextField
                autoComplete="off"
                fullWidth
                id="password"
                label="Password"
                margin="normal"
                name="password"
                required
                type="password"
            />

            <Box
                alignItems="center"
                display="flex"
                justifyContent="space-between"
                sx={{ mb: 2, mt: 3 }}>
                <Fab
                    color="success"
                    sx={{
                        px: 3,
                    }}
                    type="submit"
                    variant="extended">
                    Masuk
                </Fab>

                <Link
                    color="info"
                    component="a"
                    href={`${process.env.NEXT_PUBLIC_V2_DOMAIN}/forgot-password`}
                    variant="body2">
                    Lupa kata sandi?
                </Link>
            </Box>
        </Box>
    )
}
