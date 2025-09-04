import type { UUID } from 'crypto'
import type UserType from '@/modules/auth/types/orms/user'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Chip from '@mui/material/Chip'
// components
import FlexColumnBox from '@/components/FlexColumnBox'
import LineChart from '@/components/Chart/Line/Line'
import ScrollableXBox from '@/components/ScrollableXBox'
import StatCard from '@/components/StatCard'
// etc

export default function TbsPerformanceChart({ user }: { user: UserType }) {
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
                    label="12 Hari Terakhir"
                    color={isDailyData ? 'success' : undefined}
                    onClick={
                        isDailyData
                            ? undefined
                            : () => replace(`?dataUnit=days&nData=12`)
                    }
                />
                <Chip
                    label="12 Minggu Terakhir"
                    color={isWeeklyData ? 'success' : undefined}
                    onClick={
                        isWeeklyData
                            ? undefined
                            : () => replace(`?dataUnit=weeks&nData=12`)
                    }
                />
                <Chip
                    label="12 Bulan Terakhir"
                    color={isMonthlyData ? 'success' : undefined}
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
            nData: nData,
            dataUnit: dataUnit,
        },
    ])

    return (
        <StatCard title="Bobot TBS" isLoading={isLoading}>
            <LineChart
                suffix="kg"
                data={data}
                slotsProps={{
                    tooltip: {
                        labelFormatter: value =>
                            `${getXAxisLabel(dataUnit as string)} ${value}`,
                    },
                }}
                lines={[
                    {
                        type: 'monotone',
                        dataKey: 'n_kg',
                        name: 'Bobot',
                        stroke: 'var(--mui-palette-primary-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'deduction_kg',
                        name: 'Potongan',
                        stroke: 'var(--mui-palette-error-main)',
                    },
                    {
                        type: 'monotone',
                        dataKey: 'incentive_kg',
                        name: 'Insentif',
                        stroke: 'var(--mui-palette-success-main)',
                    },
                ]}
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
            nData: nData,
            dataUnit: dataUnit,
        },
    ])

    return (
        <StatCard title="Bobot Angkut TBS" isLoading={isLoading}>
            <LineChart
                suffix="kg"
                data={data}
                slotsProps={{
                    tooltip: {
                        labelFormatter: value =>
                            `${getXAxisLabel(dataUnit as string)} ${value}`,
                    },
                }}
            />
        </StatCard>
    )
}
