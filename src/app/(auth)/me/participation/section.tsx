// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
//
import type { ReactNode } from 'react'
import LineChartCard from '@/components/line-chart-card'
// components
import BigNumberCard from '@/components/stat-card.big-number-card'
// types
import type SectionData from '@/types/section-data'
import SectionHeader from './section.header'

export default function Section({
    title,
    iconTitle,
    detailHref,
    data,
}: {
    title: string
    iconTitle: ReactNode
    detailHref?: string
    data?: SectionData
}) {
    const { bigNumber1, bigNumber2, lineChart } = data ?? {}

    return (
        <Box mb={3}>
            <SectionHeader
                detailHref={detailHref}
                iconTitle={iconTitle}
                title={title}
            />
            <Grid container mb={2} spacing={2}>
                <Grid
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    {bigNumber1 && <BigNumberCard {...bigNumber1} />}
                </Grid>

                <Grid
                    size={{
                        md: 6,
                        xs: 12,
                    }}>
                    {bigNumber2 && <BigNumberCard {...bigNumber2} />}
                </Grid>
            </Grid>
            {lineChart && (
                <LineChartCard
                    suffix={bigNumber1?.number1Suffix}
                    {...lineChart}
                />
            )}
        </Box>
    )
}
