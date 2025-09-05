// types
import type UserType from '@/modules/user/types/orms/user'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// components
import { ContactList } from '@/components/User/Socials/CrudBox'
import TbsPerformanceChart from './tbs-performance-chart'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function CreditorCard({ data: creditor }: { data: UserType }) {
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
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center">
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

                    <ContactList data={creditor?.socials ?? []} readMode />

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
