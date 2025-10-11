import Skeleton from '@mui/material/Skeleton'
import { forwardRef, type LegacyRef } from 'react'

const Skeletons = forwardRef(function Skeletons(_, ref) {
    return (
        <div ref={ref as LegacyRef<HTMLDivElement>}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
        </div>
    )
})

export default Skeletons
