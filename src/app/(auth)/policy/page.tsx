// materials
import Paper from '@mui/material/Paper'
import PolicyActions from './actions'
// parts
import PolicyContent from './content'

export default function Page() {
    return (
        <>
            <div
                style={{
                    marginBottom: '2rem',
                }}>
                <PolicyContent />
            </div>

            <Paper
                sx={{
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    p: 3,
                    position: 'sticky',
                }}>
                <PolicyActions />
            </Paper>
        </>
    )
}
