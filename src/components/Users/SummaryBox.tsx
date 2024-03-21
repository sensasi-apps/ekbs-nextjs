// vendors
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// etc
import { getRoleIconByIdName } from '../User/RoleChips'
import Tooltip from '../Tooltip'

type ApiResponseItemType = {
    role_name_id: string
    qty: number
    user_names: string[]
}

type ApiResponseType = ApiResponseItemType[]

export default function UsersSummaryBox() {
    const { data, isLoading } = useSWR<ApiResponseType>('/users/summary')

    return (
        <Box
            display="flex"
            gap={2}
            textTransform="capitalize"
            sx={{
                overflowX: 'auto',
                flexDirection: {
                    md: 'column',
                },
                whiteSpace: 'pre-line',
            }}>
            {isLoading && (
                <>
                    <Skeleton variant="rounded" width={300} height={118} />
                    <Skeleton variant="rounded" width={300} height={118} />
                    <Skeleton variant="rounded" width={300} height={118} />
                </>
            )}

            {data?.map((item, i) => <SummaryCard key={i} data={item} />)}
        </Box>
    )
}

function SummaryCard({
    data: { role_name_id, qty, user_names },
}: {
    data: ApiResponseItemType
}) {
    return (
        <Tooltip
            title={
                <>
                    {user_names.map((name, i) => (
                        <div key={i}>{name}</div>
                    ))}

                    {user_names.length < qty && <div>....</div>}
                </>
            }>
            <Card>
                <Box p={3} display="flex" alignItems="center">
                    {getRoleIconByIdName(
                        role_name_id.toLowerCase(),
                        { fontSize: 64, mr: 3 },
                        true,
                    )}

                    <Box>
                        <Typography
                            fontSize={14}
                            color="text.secondary"
                            gutterBottom>
                            {role_name_id}
                        </Typography>

                        <Typography variant="h4" component="div">
                            {qty}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Tooltip>
    )
}
