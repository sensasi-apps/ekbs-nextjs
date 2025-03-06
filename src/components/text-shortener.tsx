import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Info from '@mui/icons-material/Info'

export default function TextShortener({
    text,
    maxChar = 6,
}: {
    text: string
    maxChar?: number
}) {
    return (
        <Tooltip
            title={
                <Box display="flex" gap={0.5} alignItems="center">
                    <Info
                        sx={{
                            fontSize: '1.5em',
                        }}
                    />
                    {text}
                </Box>
            }
            sx={{
                textTransform: 'uppercase',
            }}
            arrow
            placement="right"
            leaveDelay={1000}>
            <span
                style={{
                    cursor: 'help',
                    textDecoration: 'underline',
                    textDecorationStyle: 'dashed',
                }}>
                {text.slice(-maxChar)}
            </span>
        </Tooltip>
    )
}
