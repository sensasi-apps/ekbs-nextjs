import useSWR from 'swr'
import { useMemo } from 'react'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import { getRoleIconByIdName } from '../User/RoleChips'

const ICON_SX = { fontSize: 64, mr: 3 }

const BOX_SX = {
    overflowX: 'auto',
    flexDirection: {
        md: 'column',
    },
}

const SummaryCard = ({ title, count }) => (
    <Box>
        <Card>
            <Box p={3} display="flex" alignItems="center">
                {getRoleIconByIdName(title, ICON_SX, true)}

                <Box>
                    <Typography
                        fontSize={14}
                        color="text.secondary"
                        gutterBottom>
                        {title}
                    </Typography>

                    <Typography variant="h4" component="div">
                        {count}
                    </Typography>
                </Box>
            </Box>
        </Card>
    </Box>
)

const skeletons = (
    <>
        <Skeleton variant="rounded" width={300} height={118} />
        <Skeleton variant="rounded" width={300} height={118} />
        <Skeleton variant="rounded" width={300} height={118} />
    </>
)

const UsersSummaryBox = () => {
    const { data } = useSWR('/users/summary', url =>
        axios.get(url).then(({ data }) => data),
    )

    const cards = useMemo(() => {
        if (!data) return skeletons

        return Object.keys(data).map((key, i) => (
            <SummaryCard key={i} title={key} count={data[key]} />
        ))
    }, [data])

    return (
        <Box display="flex" gap={2} textTransform="capitalize" sx={BOX_SX}>
            {cards}
        </Box>
    )
}

export default UsersSummaryBox
