import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

const LoadingAddorment = ({ show }) =>
    show ? (
        <InputAdornment position="start">
            <CircularProgress size={20} />
        </InputAdornment>
    ) : null

export default LoadingAddorment
