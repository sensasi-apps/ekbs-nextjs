'use client'

import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { useEffect, useState } from 'react'
import Fab from '@/components/fab'

export default function ScrollToTopFab() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setShow(window.scrollY > 100)
        }

        addEventListener('scroll', handleScroll)

        return () => {
            removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <Fab
            aria-label="kembali ke atas"
            color="info"
            in={show}
            onClick={() => scrollTo({ top: 0 })}
            size="small">
            <ArrowUpwardIcon />
        </Fab>
    )
}
