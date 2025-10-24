// materials

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'

type UserStatCardProps = {
    text: string
    value: number | string
    unit?: string
    Icon: typeof SvgIcon
    iconColor?: 'error'
}

export default function UserStatCard({
    text,
    value,
    unit,
    Icon,
    iconColor,
}: UserStatCardProps) {
    return (
        <Card sx={{ height: '100%', width: '100%' }}>
            <CardContent
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    gap: 2,
                    px: 4,
                    py: 3,
                }}>
                <Icon color={iconColor} sx={{ fontSize: 40 }} />

                <Box>
                    <Typography fontWeight="bold" variant="h5">
                        {value} {unit}
                    </Typography>
                    <Typography variant="body2">{text}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
