// types

// icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import type UserType from '@/modules/user/types/orms/user'
// utils
import numberToCurrency from '@/utils/number-to-currency'
// components
import TbsPerformanceChart from './tbs-performance-chart'

export default function CreditorCard({
    data: creditor,
}: {
    data: Pick<UserType, 'id' | 'uuid' | 'name'>
}) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const { data: totalRpActiveInstallment = 0, isLoading } = useSWR<number>(
        `users/${creditor.uuid}/get-total-rp-active-installments`,
    )

    return (
        <Card elevation={2}>
            <CardActionArea onClick={() => setIsCollapsed(prev => !prev)}>
                <CardHeader
                    disableTypography
                    title={
                        <Box
                            alignItems="center"
                            display="flex"
                            justifyContent="space-between">
                            <Box display="flex" gap={1}>
                                <Typography color="GrayText" component="span">
                                    #{creditor?.id}
                                </Typography>
                                <Typography component="span">
                                    {creditor?.name}
                                </Typography>
                            </Box>

                            {isCollapsed ? (
                                <KeyboardArrowDownIcon />
                            ) : (
                                <KeyboardArrowUpIcon />
                            )}
                        </Box>
                    }
                />
            </CardActionArea>
            <Collapse in={!isCollapsed}>
                <CardContent
                    sx={{
                        pt: 0,
                    }}>
                    <Typography color="GrayText" mt={1}>
                        Kontak:
                    </Typography>

                    <Typography color="GrayText" mt={1}>
                        Total Angsuran Aktif Saat Ini:
                    </Typography>

                    <Typography>
                        {!isLoading ? (
                            numberToCurrency(totalRpActiveInstallment)
                        ) : (
                            <Skeleton variant="rounded" />
                        )}
                    </Typography>

                    <Typography color="GrayText" mt={1}>
                        Performa:
                    </Typography>

                    <TbsPerformanceChart user={creditor} />
                </CardContent>
            </Collapse>
        </Card>
    )
}
