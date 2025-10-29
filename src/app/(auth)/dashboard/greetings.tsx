'use client'

import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import useAuthInfo from '@/hooks/use-auth-info'

export default function Greeting() {
    const user = useAuthInfo()

    return (
        <Typography component="div" mb={4} variant="h5">
            Selamat datang,{' '}
            {user?.name ? (
                <Typography color="info.main" component="span" variant="h5">
                    {user?.name}
                </Typography>
            ) : (
                <Skeleton
                    component="span"
                    height="2rem"
                    variant="rounded"
                    width="7rem"
                />
            )}
        </Typography>
    )
}
