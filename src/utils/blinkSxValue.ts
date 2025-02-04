import { keyframes } from '@mui/material/styles'

const keyframe = keyframes`
0% { opacity: 0; }
50% { opacity: 1; }
100% { opacity: 0; }
`
const blinkSxValue = {
    animation: `${keyframe} 1s linear infinite`,
}

export default blinkSxValue
