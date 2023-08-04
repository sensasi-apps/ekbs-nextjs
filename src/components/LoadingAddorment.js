import PropTypes from 'prop-types'
import { InputAdornment, CircularProgress } from '@mui/material'

const LoadingAddorment = ({ show }) =>
    show ? (
        <InputAdornment position="start">
            <CircularProgress size={20} />
        </InputAdornment>
    ) : null

LoadingAddorment.propTypes = {
    show: PropTypes.bool.isRequired,
}

export default LoadingAddorment
