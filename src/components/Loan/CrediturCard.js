import { useState } from 'react'

import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Collapse from '@mui/material/Collapse'
import Typography from '@mui/material/Typography'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { ContactList } from '../User/Socials/CrudBox'

const CrediturCard = ({ data: creditur }) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    return (
        <Card elevation={2}>
            <CardActionArea onClick={() => setIsCollapsed(prev => !prev)}>
                <CardHeader
                    title={
                        <>
                            {creditur?.name}
                            <Typography
                                ml={1}
                                variant="h6"
                                color="GrayText"
                                component="span">
                                #{creditur?.id}
                            </Typography>
                        </>
                    }
                    action={
                        isCollapsed ? (
                            <KeyboardArrowDownIcon />
                        ) : (
                            <KeyboardArrowUpIcon />
                        )
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
                        Riwayat TBS:
                    </Typography>
                    <Typography>
                        <i>Akan datang</i>
                    </Typography>
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default CrediturCard
