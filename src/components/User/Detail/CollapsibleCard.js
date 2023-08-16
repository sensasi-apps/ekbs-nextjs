import { useState } from 'react'

import {
    Card,
    CardContent,
    CardHeader,
    CircularProgress,
    Collapse,
    IconButton,
} from '@mui/material'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import UserDetailBox from './Box'

import useUserWithDetails from '@/providers/UserWithDetails'

const CARD_CONTENT_SX = {
    pt: 0,
}

const UserDetailCollapsibleCard = ({ editButton }) => {
    const { data: { detail = {} } = {}, isLoading } = useUserWithDetails()

    const [open, setOpen] = useState(false)

    const handleCollapseClick = () => {
        setOpen(prev => !prev)
    }

    return (
        <Card>
            <CardHeader
                title="Detail Pengguna"
                titleTypographyProps={{
                    variant: 'body',
                    fontWeight: 'bold',
                }}
                action={
                    <IconButton
                        disabled={isLoading}
                        onClick={handleCollapseClick}>
                        {isLoading && (
                            <CircularProgress size={20} color="inherit" />
                        )}
                        {!isLoading && !open && <KeyboardArrowDownIcon />}
                        {!isLoading && open && <KeyboardArrowUpIcon />}
                    </IconButton>
                }
            />

            <Collapse in={open && !isLoading}>
                <CardContent sx={CARD_CONTENT_SX}>
                    <UserDetailBox data={detail} />

                    {editButton}
                </CardContent>
            </Collapse>
        </Card>
    )
}

export default UserDetailCollapsibleCard
