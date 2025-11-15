import Skeleton from '@mui/material/Skeleton'
import type { Ref } from 'react'

export default function Skeletons({ ref }: { ref?: Ref<HTMLDivElement> }) {
    return (
        <div ref={ref}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </div>
    )
}
