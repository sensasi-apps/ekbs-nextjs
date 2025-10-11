import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
// materials
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import CircularProgress from '@mui/material/CircularProgress'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import { type ReactNode, useState } from 'react'
import LoadingCenter from '@/components/loading-center'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
//
import UserDetailBox from './Box'

export default function UserDetailCollapsibleCard({
    editButton,
}: {
    editButton: ReactNode
}) {
    const { data: { detail } = {}, isLoading } = useUserDetailSwr()

    const [open, setOpen] = useState(false)

    const handleCollapseClick = () => {
        setOpen(prev => !prev)
    }

    if (!detail) return <LoadingCenter />

    return (
        <Card>
            <CardHeader
                action={
                    <IconButton
                        disabled={isLoading}
                        onClick={handleCollapseClick}>
                        {isLoading && (
                            <CircularProgress color="inherit" size={20} />
                        )}
                        {!isLoading && !open && <KeyboardArrowDownIcon />}
                        {!isLoading && open && <KeyboardArrowUpIcon />}
                    </IconButton>
                }
                title="Detail Pengguna"
                titleTypographyProps={{
                    fontWeight: 'bold',
                }}
            />

            <Collapse in={open && !isLoading}>
                <CardContent
                    sx={{
                        pt: 0,
                    }}>
                    <UserDetailBox data={detail} />

                    {editButton}
                </CardContent>
            </Collapse>
        </Card>
    )
}
