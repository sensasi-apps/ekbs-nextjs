// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

export function Form({
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

            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>
                Sign In
            </Button>
        </Box>
    )
}
