import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

export default function LoadingAddorment({ show }: { show: boolean }) {
    return show ? (
        <InputAdornment position="start">
            <CircularProgress size={20} />
        </InputAdornment>
    ) : null
}
