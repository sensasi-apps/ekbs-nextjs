// vendors

// icons
import Diversity3Icon from '@mui/icons-material/Diversity3'
// materials
import Grid from '@mui/material/Grid'
import useSWR from 'swr'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import MonthlyTotalMemberInOutChartCard from '@/components/pages/executive/statistics/charts/MonthlyTotalMemberInOutChartCard'
import MonthlyTotalMemberParticipationChartCard from '@/components/pages/executive/statistics/charts/MonthlyTotalMemberParticipationChartCard'
// pages
import TotalActiveMemberBigNumber from '@/components/pages/executive/statistics/charts/TotalActiveMemberBigNumber'
import TotalMemberParticipationBigNumber from '@/components/pages/executive/statistics/charts/TotalMemberParticipationBigNumber'
import Heading2 from '../Heading2'
// constants
import SX_SCROLL_MARGIN_TOP from '../SX_SCROLL_MARGIN_TOP'

type DataItem = {
    value: number
    month: string
}

export default function MemberSection() {
    const { data, isLoading } = useSWR<{
        member_total: number
        monthly_member_in_outs: DataItem[]
        monthly_member_participations: DataItem[]
    }>('executive/member-section-data')

    return (
        <FlexColumnBox>
            <Heading2
                id="anggota"
                startIcon={<Diversity3Icon />}
                sx={SX_SCROLL_MARGIN_TOP}>
                Anggota
            </Heading2>

            <Grid container spacing={2}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    id="total-anggota"
                    size={{ sm: 4, xs: 12 }}
                    sx={SX_SCROLL_MARGIN_TOP}>
                    <TotalActiveMemberBigNumber
                        data={data?.member_total}
                        isLoading={isLoading}
                    />

                    <TotalMemberParticipationBigNumber
                        currentParticipationTotal={
                            data?.monthly_member_participations[
                                data?.monthly_member_participations.length - 1
                            ].value
                        }
                        isLoading={isLoading}
                        memberTotal={data?.member_total}
                    />
                </Grid>

                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    id="total-partisipasi"
                    size={{ sm: 8, xs: 12 }}
                    sx={SX_SCROLL_MARGIN_TOP}>
                    <MonthlyTotalMemberInOutChartCard
                        data={data?.monthly_member_in_outs}
                        isLoading={isLoading}
                    />

                    <MonthlyTotalMemberParticipationChartCard
                        data={data?.monthly_member_participations}
                        isLoading={isLoading}
                    />
                </Grid>
            </Grid>
        </FlexColumnBox>
    )
}
