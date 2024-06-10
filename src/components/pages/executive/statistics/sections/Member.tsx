// vendors
import useSWR from 'swr'
// materials
import Grid2 from '@mui/material/Unstable_Grid2'
// icons
import Diversity3Icon from '@mui/icons-material/Diversity3'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import Heading2 from '../Heading2'
// pages
import TotalActiveMemberBigNumber from '@/components/pages/executive/statistics/charts/TotalActiveMemberBigNumber'
import MonthlyTotalMemberInOutChartCard from '@/components/pages/executive/statistics/charts/MonthlyTotalMemberInOutChartCard'
import TotalMemberParticipationBigNumber from '@/components/pages/executive/statistics/charts/TotalMemberParticipationBigNumber'
import MonthlyTotalMemberParticipationChartCard from '@/components/pages/executive/statistics/charts/MonthlyTotalMemberParticipationChartCard'
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'

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

            <Grid2 container spacing={2}>
                <Grid2
                    id="total-anggota"
                    xs={12}
                    sm={4}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={SX_SCROLL_MARGIN_TOP}>
                    <TotalActiveMemberBigNumber
                        data={data?.member_total}
                        isLoading={isLoading}
                    />

                    <TotalMemberParticipationBigNumber
                        memberTotal={data?.member_total}
                        currentParticipationTotal={
                            data?.monthly_member_participations[
                                data?.monthly_member_participations.length - 1
                            ].value
                        }
                        isLoading={isLoading}
                    />
                </Grid2>

                <Grid2
                    id="total-partisipasi"
                    xs={12}
                    sm={8}
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    sx={SX_SCROLL_MARGIN_TOP}>
                    <MonthlyTotalMemberInOutChartCard
                        data={data?.monthly_member_in_outs}
                        isLoading={isLoading}
                    />

                    <MonthlyTotalMemberParticipationChartCard
                        data={data?.monthly_member_participations}
                        isLoading={isLoading}
                    />
                </Grid2>
            </Grid2>
        </FlexColumnBox>
    )
}
