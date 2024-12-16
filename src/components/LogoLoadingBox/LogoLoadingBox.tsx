import Box, { BoxProps } from '@mui/material/Box'
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress'

export const LogoLoadingBox = ({
    display = 'flex',
    justifyContent = 'center',
    alignItems = 'center',
    height = '100dvh',
    ...restProps
}: BoxProps) => (
    <Box
        display={display}
        justifyContent={justifyContent}
        alignItems={alignItems}
        height={height}
        {...restProps}>
        <Image
            src="/assets/pwa-icons/green-transparent.svg"
            width={150}
            height={150}
            alt="logo"
            priority
            style={{
                position: 'absolute',
            }}
        />

        <CircularProgress
            size={200}
            thickness={1}
            color="success"
            style={{
                position: 'absolute',
            }}
        />
    </Box>
)

export default LogoLoadingBox
