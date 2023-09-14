import { FC, useState } from 'react'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { ContactList } from '../User/Socials/CrudBox'
import TbsPerformanceChart from './Creditur/TbsPerformanceChart'
import UserDataType from '@/dataTypes/User'

const CrediturCard: FC<{
    data: UserDataType
}> = ({ data: creditur }) => {
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
                    <ContactList
                        data={creditur?.socials}
                        readMode
                        userUuid={undefined} //TODO: ContactList jsx to tsx
                    />

                    <Typography color="GrayText" mt={1}>
                        Performa:
                    </Typography>

                    <Box height="200px" mt={1}>
                        <TbsPerformanceChart
                            data={
                                creditur?.last_six_months_tbs_performance || []
                            }
                        />
                    </Box>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default CrediturCard
