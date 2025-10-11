import Info from '@mui/icons-material/Info'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'

export default function TextShortener({
    text,
    maxChar = 7,
}: {
    text: string
    maxChar?: number
}) {
    return (
        <Tooltip
            arrow
            leaveDelay={1000}
            placement="right"
            sx={{
                textTransform: 'uppercase',
            }}
            title={
                <Box alignItems="center" display="flex" gap={0.5}>
                    <Info
                        sx={{
                            fontSize: '1.5em',
                        }}
                    />
                    {text}
                </Box>
            }>
            <span
                style={{
                    cursor: 'help',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dashed',
                }}>
                {text.slice(-maxChar).toUpperCase()}
            </span>
        </Tooltip>
    )
}
