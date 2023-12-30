// types
import type UserType from '@/dataTypes/User'
// vendors
import { useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'
// icons
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// components
import { ContactList } from '@/components/User/Socials/CrudBox'
import TbsPerformanceChartWithAutoFetch from './CrediturCard/TbsPerformanceChart/WithAutoFetch'

export default function CrediturCard({ data: creditur }: { data: UserType }) {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <Card elevation={2}>
            <CardActionArea onClick={() => setIsCollapsed(prev => !prev)}>
                <CardHeader
                    title={
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            pr={1}>
                            <Box>
                                {creditur?.name}
                                <Typography
                                    ml={1}
                                    variant="h6"
                                    color="GrayText"
                                    component="span">
                                    #{creditur?.id}
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

                    <ContactList data={creditur?.socials} readMode />

                    <Typography color="GrayText" mt={1}>
                        Performa:
                    </Typography>

                    <TbsPerformanceChartWithAutoFetch
                        data={creditur.last_six_months_tbs_performance}
                        userUuid={creditur.uuid}
                    />
                </CardContent>
            </Collapse>
        </Card>
    )
}
