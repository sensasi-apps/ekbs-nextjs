'use client'

import { useState } from 'react'
import axios from '@/lib/axios'

import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import Skeleton from '@mui/material/Skeleton'
import Switch from '@mui/material/Switch'

import LoadingCenter from '../Statuses/LoadingCenter'

const SkeletonDataLoading = () => (
    <Skeleton
        variant="rounded"
        width={48}
        height={48}
        sx={{
            mt: 2,
        }}
    />
)

export default function ActivationToggle({
    data: user,
    isLoading: isDataLoading,
    disabled,
}) {
    if (!user && !isDataLoading) return null
    if (isDataLoading) return <SkeletonDataLoading />

    const [isUserActive, setIsUserActive] = useState(user.is_active)
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState(null)

    const handleChange = async () => {
        setIsLoading(true)

        try {
            const { data: responseData } = await axios.put(
                `/users/${user.uuid}/set-active`,
                {
                    is_active: !isUserActive,
                },
            )

            setIsUserActive(responseData.is_active)
        } catch (error) {
            console.error(error.response)
            setErrorMessage(error.response.message)
        }

        setIsLoading(false)
    }

    if (isLoading) return <LoadingCenter />

    return (
        <FormControl
            fullWidth
            margin="normal"
            disabled={!user.email || disabled}
            error={Boolean(errorMessage)}>
            <FormLabel>Status Akun</FormLabel>
            <FormControlLabel
                onChange={handleChange}
                sx={{
                    color: isUserActive ? 'success.light' : 'text.secondary',
                }}
                label={isUserActive ? 'Aktif' : 'Nonaktif'}
                control={
                    <Switch
                        color="success"
                        name="is_active"
                        checked={isUserActive}
                    />
                }
            />

            {Boolean(errorMessage) && (
                <FormHelperText>{errorMessage}</FormHelperText>
            )}
        </FormControl>
    )
}
