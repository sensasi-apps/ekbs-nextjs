// vendors
import { useRouter } from 'next/router'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// etc
import { getRoleIconByIdName } from '../User/RoleChips'
import formatNumber from '@/utils/format-number'

interface ApiResponseItemType {
    role_name_id: string
    role_name?: string
    qty: number
    user_names: string[]
}

export default function UsersSummaryBox() {
    const { data, isLoading } = useSWR<ApiResponseItemType[]>(
        'users/get-summary-data',
    )

    return (
        <Box
            display="flex"
            gap={2}
            sx={{
                alignItems: {
                    xs: 'center',
                    md: 'stretch',
                },
                overflowX: 'auto',
                flexDirection: {
                    md: 'column',
                },
            }}>
            {isLoading && (
                <>
                    <Skeleton variant="rounded" width={300} height={118} />
                    <Skeleton variant="rounded" width={300} height={118} />
                    <Skeleton variant="rounded" width={300} height={118} />
                </>
            )}

            {data?.map((item, i) => (
                <SummaryCard key={i} data={item} />
            ))}
        </Box>
    )
}

function SummaryCard({
    data: { role_name_id, qty, user_names, role_name },
}: {
    data: ApiResponseItemType
}) {
    const { replace, query } = useRouter()

    return (
        <Card
            variant={query.role === role_name ? 'outlined' : 'elevation'}
            sx={{
                minWidth: {
                    xs: 300,
                    md: undefined,
                },
                borderColor:
                    query.role === role_name ? 'success.main' : undefined,
                color: query.role === role_name ? 'success.main' : undefined,
            }}>
            <CardActionArea
                disabled={!qty}
                onClick={() =>
                    replace({
                        query: {
                            role: query.role === role_name ? '' : role_name,
                        },
                    })
                }>
                <Tooltip
                    arrow
                    placement="left"
                    title={
                        <>
                            {user_names.map((name, i) => (
                                <div key={i}>{name}</div>
                            ))}

                            {user_names.length < qty && <div>....</div>}
                        </>
                    }>
                    <CardContent
                        sx={{
                            p: 3,
                        }}>
                        <Box display="flex" gap={2} alignItems="center">
                            {getRoleIconByIdName(
                                role_name_id.toLowerCase(),
                                { fontSize: 64 },
                                true,
                            )}

                            <Box>
                                <Typography
                                    fontSize={14}
                                    gutterBottom
                                    textTransform="capitalize">
                                    {role_name_id}
                                </Typography>

                                <Typography variant="h4" component="div">
                                    {formatNumber(qty)}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Tooltip>
            </CardActionArea>
        </Card>
    )
}
