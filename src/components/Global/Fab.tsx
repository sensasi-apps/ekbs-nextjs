import MuiFab, { FabProps } from '@mui/material/Fab'

export default function Fab(props: FabProps) {
    return (
        <MuiFab
            color="success"
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
            }}
            {...props}
        />
    )
}
