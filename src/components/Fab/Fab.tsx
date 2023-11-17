import MuiFab, { FabProps } from '@mui/material/Fab'

/**
 * A floating action button component.
 * @default
 * - color: success
 * - sx: { position: 'fixed', bottom: 16, right: 16 }
 * @param {FabProps} props - The props for the component.
 * @returns \@mui/material/Fab.
 */
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
