// materials
import Chip from '@mui/material/Chip'
import type { UUID } from 'crypto'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import LineChart from '@/components/Chart/Line/Line'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import ScrollableXBox from '@/components/ScrollableXBox'
import StatCard from '@/components/StatCard'
import type UserType from '@/modules/user/types/orms/user'
// etc

export default function TbsPerformanceChart({
    user,
}: {
    user: Pick<UserType, 'uuid'>
}) {
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const dataUnit = searchParams?.get('dataUnit')

    const isDailyData = dataUnit === 'days'
    const isWeeklyData = dataUnit === 'weeks'
    const isMonthlyData = dataUnit === 'months'

    return (
        <FlexColumnBox>
            <ScrollableXBox>
                <Chip
                    color={isDailyData ? 'success' : undefined}
                    label="12 Hari Terakhir"
                    onClick={
                        isDailyData
                            ? undefined
                            : () => replace(`?dataUnit=days&nData=12`)
                    }
                />
                <Chip
                    color={isWeeklyData ? 'success' : undefined}
                    label="12 Minggu Terakhir"
                    onClick={
                        isWeeklyData
                            ? undefined
                            : () => replace(`?dataUnit=weeks&nData=12`)
                    }
                />
                <Chip
                    color={isMonthlyData ? 'success' : undefined}
                    label="12 Bulan Terakhir"
                    onClick={
                        isMonthlyData
                            ? undefined
                            : () => replace(`?dataUnit=months&nData=12`)
                    }
                />
            </ScrollableXBox>

            <PalmBunchWeightChart userUuid={user.uuid} />
            <PalmBunchDeliveryChart userUuid={user.uuid} />
        </FlexColumnBox>
    )
}

function getXAxisLabel(dataUnit: string) {
    switch (dataUnit) {
        case 'days':
            return 'Tanggal'

        case 'weeks':
            return 'Minggu ke-'

        case 'months':
            return 'Bulan'

        default:
            throw new Error('dataUnit is undefined')
    }
}

function PalmBunchWeightChart({ userUuid }: { userUuid: UUID }) {
    const searchParams = useSearchParams()

    const dataUnit = searchParams?.get('dataUnit') ?? 'weeks'
    const nData = searchParams?.get('nData') ?? 12

    const { data, isLoading } = useSWR([
        `palm-bunches/farmer/performances/${userUuid}`,
        {
            dataUnit: dataUnit,
            nData: nData,
        },
    ])

    return (
        <StatCard isLoading={isLoading} title="Bobot TBS">
            <LineChart
                data={data}
                lines={[
                    {
                        dataKey: 'n_kg',
                        name: 'Bobot',
                        stroke: 'var(--mui-palette-primary-main)',
                        type: 'monotone',
                    },
                    {
                        dataKey: 'deduction_kg',
                        name: 'Potongan',
                        stroke: 'var(--mui-palette-error-main)',
                        type: 'monotone',
                    },
                    {
                        dataKey: 'incentive_kg',
                        name: 'Insentif',
                        stroke: 'var(--mui-palette-success-main)',
                        type: 'monotone',
                    },
                ]}
                slotsProps={{
                    tooltip: {
                        labelFormatter: value =>
                            `${getXAxisLabel(dataUnit as string)} ${value}`,
                    },
                }}
                suffix="kg"
            />
        </StatCard>
    )
}

function PalmBunchDeliveryChart({ userUuid }: { userUuid: UUID }) {
    const searchParams = useSearchParams()

    const dataUnit = searchParams?.get('dataUnit') ?? 'weeks'
    const nData = searchParams?.get('nData') ?? 12

    const { data, isLoading } = useSWR([
        `palm-bunches/courier/performances/${userUuid}`,
        {
            dataUnit: dataUnit,
            nData: nData,
        },
    ])

    return (
        <StatCard isLoading={isLoading} title="Bobot Angkut TBS">
            <LineChart
                data={data}
                slotsProps={{
                    tooltip: {
                        labelFormatter: value =>
                            `${getXAxisLabel(dataUnit as string)} ${value}`,
                    },
                }}
                suffix="kg"
            />
        </StatCard>
    )
}
