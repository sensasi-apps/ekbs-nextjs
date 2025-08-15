'use client'

// vendors
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import myAxios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// components
import LoadingCenter from '@/components/loading-center'
// hooks
import useAuthInfoState from '@/hooks/use-auth-info-state'

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
                        size="large"
                        type="submit"
                        variant="contained"
                        fullWidth>
                        Saya telah membaca dan menyetujui Syarat, Ketentuan, dan
                        Kebijakan Privasi ini
                    </Button>
                </form>
            )}

            {authInfo.is_agreed_tncp && (
                <Button onClick={back} startIcon={<ArrowBackIcon />} fullWidth>
                    Kembali
                </Button>
            )}

            {!authInfo.is_agreed_tncp && (
                <Button
                    size="small"
                    href="/logout"
                    endIcon={<ArrowForwardIcon />}
                    fullWidth>
                    Saya tidak menyetujui Syarat, Ketentuan, dan Kebijakan
                    (logout)
                </Button>
            )}
        </>
    )
}
