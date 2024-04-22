import Button from '@mui/material/Button'
import { OptionsObject } from 'notistack'

const SNACKBAR_419_OPTIONS: OptionsObject<'warning'> = {
    variant: 'warning',
    persist: true,
    action: () => (
        <Button
            onClick={() => location.reload()}
            variant="outlined"
            size="small"
            color="inherit">
            Segarkan Sekarang
        </Button>
    ),
}

export default SNACKBAR_419_OPTIONS
