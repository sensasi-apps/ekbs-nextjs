import { useEffect, useState } from 'react'
import Fab from '../Fab'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

export default function ScrollToTopFab() {
    const [show, setShow] = useState(false)

    const handleScroll = () => {
        setShow(window.scrollY > 100)
    }

    useEffect(() => {
        addEventListener('scroll', handleScroll)

        return () => {
            removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <Fab
            in={show}
            size="small"
            aria-label="kembali ke atas"
            color="info"
            onClick={() => scrollTo({ top: 0 })}>
            <ArrowUpwardIcon />
        </Fab>
    )
}
