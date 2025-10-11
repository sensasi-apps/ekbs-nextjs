import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'

export default function LoadingAddorment({ show }: { show: boolean }) {
    return show ? (
        <InputAdornment position="start">
            <CircularProgress size={20} />
        </InputAdornment>
    ) : null
}
