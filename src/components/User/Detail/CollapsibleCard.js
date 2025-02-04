import { useState } from 'react'
// materials
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
//
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
