import Head from 'next/head'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'

import useAuth from '@/providers/Auth'
import debounce from '@/lib/debounce'

export default function Index() {
    const router = useRouter()
    const { user } = useAuth()

    useEffect(() => {
        if (user === null)
            debounce(() => {
                router.replace('/login')
            }, 500)

        if (user)
            debounce(() => {
                router.replace('/dashboard')
            }, 500)
    }, [user])

    return (
        <Fade in={true}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}>
                <Head>
                    <title>{process.env.NEXT_PUBLIC_APP_NAME}</title>
                </Head>

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
            </div>
        </Fade>
    )
}
