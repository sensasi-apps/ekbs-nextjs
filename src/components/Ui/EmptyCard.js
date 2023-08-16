import PropTypes from 'prop-types'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

const EmptyCard = ({ name }) => (
    <Card>
        <CardContent
            sx={{
                textAlign: 'center',
            }}>
            <Typography component="i">Belum ada data {name}</Typography>
        </CardContent>
    </Card>
)

EmptyCard.propTypes = {
    name: PropTypes.string.isRequired,
}

export default EmptyCard
