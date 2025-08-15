// materials
import Paper from '@mui/material/Paper'
// parts
import PolicyContent from './content'
import PolicyActions from './actions'

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
                    position: 'sticky',
                    bottom: 0,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                }}>
                <PolicyActions />
            </Paper>
        </>
    )
}
