import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import { useEffect, useEffectEvent, useState } from 'react'
import Fab from '../Fab'

export default function ScrollToTopFab() {
    const [show, setShow] = useState(false)

    const handleScroll = useEffectEvent(() => {
        setShow(window.scrollY > 100)
    })

    useEffect(() => {
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
