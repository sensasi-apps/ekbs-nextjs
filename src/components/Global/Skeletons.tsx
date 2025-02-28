import { type LegacyRef, forwardRef } from 'react'

import Skeleton from '@mui/material/Skeleton'

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
