// materials
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// enums
import DataFreq from '@/enums/DataFreq'
// components
import TbsWeightChart from './TbsWeightChart'
import __ from '@/locales/__'

const TbsWeightCard = ({ freq, data }: { freq: DataFreq; data: any[] }) => (
    <Card>
        <CardContent>
            <Typography textTransform="capitalize" mb={2}>
                Statistik TBS — {__(freq)}
            </Typography>

            <TbsWeightChart data={data} />
        </CardContent>
    </Card>
)

export default TbsWeightCard
