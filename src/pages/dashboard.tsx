// vendors
import { useEffect, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import Grid2 from '@mui/material/Unstable_Grid2'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import useAuth from '@/providers/Auth'
// page components
import TbsWeightCard from '@/components/pages/dashboard/TbsWeightCard'
import useSWR from 'swr'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// enums
import DataFreq from '@/enums/DataFreq'

export default function Dashboard() {
    const { user } = useAuth()

    const [dataFreq, setDataFreq] = useState<DataFreq | undefined>()

    useEffect(() => {
        const dataFreq = localStorage.getItem('dashboard-data-freq') as DataFreq

        setDataFreq(dataFreq ?? 'monthly')
    }, [])

    const { data = [], isLoading } = useSWR<CardData[]>(
        dataFreq
            ? [
                  '/dashboard/data',
                  {
                      freq: dataFreq,
                  },
              ]
            : null,
    )

    return (
        <AuthLayout title="Dasbor">
            <Box display="inline-flex" gap={1} mb={6} flexWrap="wrap">
                <Typography variant="h5" component="div">
                    Selamat datang,
                </Typography>

                {user?.name ? (
                    <Typography color="info.main" variant="h5" component="div">
                        {user?.name}
                    </Typography>
                ) : (
                    <Skeleton
                        variant="rounded"
                        component="span"
                        width="7rem"
                        height="2rem"
                    />
                )}
            </Box>

            {data.length > 0 && (
                <Box mb={2}>
                    <FormControl
                        sx={{
                            minWidth: '8em',
                        }}>
                        <InputLabel id="freq-select-label">Tampilan</InputLabel>
                        <Select
                            label="Tampilan"
                            labelId="freq-select-label"
                            id="freq-select"
                            size="small"
                            value={dataFreq ?? ''}
                            onChange={({ target: { value } }) => {
                                localStorage.setItem(
                                    'dashboard-data-freq',
                                    value as string,
                                )
                                setDataFreq(value as DataFreq)
                            }}>
                            <MenuItem value="daily">Harian</MenuItem>
                            <MenuItem value="monthly">Bulanan</MenuItem>
                            <MenuItem value="yearly">Tahunan</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            )}

            <LoadingCenter isShow={isLoading} />

            <Grid2 container spacing={2}>
                {data?.map(getCard)}
            </Grid2>
        </AuthLayout>
    )
}

type CardData = {
    name: CardName
    freq: DataFreq
    data: any[]
}

enum CardName {
    TBS_WEIGHT = 'TbsWeight',
}

function getCard({ name, data, freq }: CardData) {
    switch (name) {
        case CardName.TBS_WEIGHT:
            return (
                <Grid2 key={name} xs={12} md={8}>
                    <TbsWeightCard data={data} freq={freq} />
                </Grid2>
            )
            break
    }
}
