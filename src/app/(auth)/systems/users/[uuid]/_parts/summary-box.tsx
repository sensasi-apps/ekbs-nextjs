// vendors

// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import LoadingCenter from '@/components/loading-center'
// etc
import { getRoleIconByIdName } from '@/components/User/RoleChips'
import formatNumber from '@/utils/format-number'

interface ApiResponseItemType {
    role_name_id: string
    role_name?: string
    qty: number
    user_names: string[]
}

export function UserSummaryBox() {
    const { data } = useSWR<ApiResponseItemType[]>('users/get-summary-data')

    if (!data) return <LoadingCenter />

    return (
        <Box
            display="flex"
            gap={2}
            sx={{
                alignItems: {
                    md: 'stretch',
                    xs: 'center',
                },
                flexDirection: {
                    md: 'column',
                },
                overflowX: 'auto',
            }}>
            {data.map(item => (
                <SummaryCard data={item} key={item.role_name_id} />
            ))}
        </Box>
    )
}

function SummaryCard({
    data: { role_name_id, qty, user_names, role_name },
}: {
    data: ApiResponseItemType
}) {
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const role = searchParams?.get('role') ?? ''

    return (
        <Card
            sx={{
                borderColor: role === role_name ? 'success.main' : undefined,
                color: role === role_name ? 'success.main' : undefined,
                minWidth: {
                    md: undefined,
                    xs: 300,
                },
            }}
            variant={role === role_name ? 'outlined' : 'elevation'}>
            <CardActionArea
                disabled={!qty}
                onClick={() => replace(`?role=${role_name}`)}>
                <Tooltip
                    arrow
                    placement="left"
                    title={
                        <>
                            {user_names.map(name => (
                                <div key={name}>{name}</div>
                            ))}

                            {user_names.length < qty && <div>....</div>}
                        </>
                    }>
                    <CardContent
                        sx={{
                            p: 3,
                        }}>
                        <Box alignItems="center" display="flex" gap={2}>
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

                                <Typography component="div" variant="h4">
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
