'use client'

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// materials
import Button from '@mui/material/Button'
import { useRouter } from 'next/navigation'
// vendors
import { useCallback } from 'react'
// components
import LoadingCenter from '@/components/loading-center'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'
import myAxios from '@/lib/axios'

export default function PolicyActions() {
    const { back } = useRouter()
    const [authInfo, setAuthInfo] = useAuthInfoState()

    const handleSubmit = useCallback(
        (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault()

            if (!authInfo) return

            myAxios.post(`/users/agree-tcnp`)

            setAuthInfo({
                ...authInfo,
                is_agreed_tncp: true,
            })

            back()
        },
        [authInfo, setAuthInfo, back],
    )

    if (!authInfo) return <LoadingCenter />

    return (
        <>
            {!authInfo.is_agreed_tncp && (
                <form onSubmit={handleSubmit}>
                    <Button
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained">
                        Saya telah membaca dan menyetujui Syarat, Ketentuan, dan
                        Kebijakan Privasi ini
                    </Button>
                </form>
            )}

            {authInfo.is_agreed_tncp && (
                <Button fullWidth onClick={back} startIcon={<ArrowBackIcon />}>
                    Kembali
                </Button>
            )}

            {!authInfo.is_agreed_tncp && (
                <Button
                    endIcon={<ArrowForwardIcon />}
                    fullWidth
                    href="/logout"
                    size="small">
                    Saya tidak menyetujui Syarat, Ketentuan, dan Kebijakan
                    (logout)
                </Button>
            )}
        </>
    )
}
