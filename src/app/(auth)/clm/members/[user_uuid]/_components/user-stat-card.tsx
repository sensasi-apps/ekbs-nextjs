// materials
import SvgIcon from '@mui/material/SvgIcon'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
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
        <Card sx={{ width: '100%', height: '100%' }}>
            <CardContent
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    px: 4,
                    py: 3,
                }}>
                <Icon sx={{ fontSize: 40 }} color={iconColor} />

                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        {value} {unit}
                    </Typography>
                    <Typography variant="body2">{text}</Typography>
                </Box>
            </CardContent>
        </Card>
    )
}
