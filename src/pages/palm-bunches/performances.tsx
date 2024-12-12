// vendors
import useSWR from 'swr'
import { useRouter } from 'next/router'
// materials
import Chip from '@mui/material/Chip'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import FlexColumnBox from '@/components/FlexColumnBox'
import LineChart from '@/components/Chart/Line/Line'
import ScrollableXBox from '@/components/ScrollableXBox'
import StatCard from '@/components/StatCard'
// etc
import useAuth from '@/providers/Auth'
import Role from '@/enums/Role'
import useDisablePage from '@/hooks/useDisablePage'

/**
 * Palm bunches performances page for farmer and courier
 * WILL BE REMOVED SOON
 *
 * @deprecated - because it's moved to the /me/participations
 */
export default function PalmBunchesPerformances() {
    useDisablePage()
    const { userHasRole } = useAuth()
    const { replace, query } = useRouter()
    const { dataUnit = 'weeks' } = query

    const isDailyData = dataUnit === 'days'
    const isWeeklyData = dataUnit === 'weeks'
    const isMonthlyData = dataUnit === 'months'

    return (
        <AuthLayout title="Performa TBS">
            {userHasRole([Role.FARMER, Role.COURIER]) && (
                <FlexColumnBox>
                    <ScrollableXBox>
                        <Chip
                            label="12 Hari Terakhir"
                            color={isDailyData ? 'success' : undefined}
                            onClick={
                                isDailyData
                                    ? undefined
                                    : () =>
                                          replace({
                                              query: {
                                                  nData: 12,
                                                  dataUnit: 'days',
                                              },
                                          })
                            }
                        />
                        <Chip
                            label="12 Minggu Terakhir"
                            color={isWeeklyData ? 'success' : undefined}
                            onClick={
                                isWeeklyData
                                    ? undefined
                                    : () =>
                                          replace({
                                              query: {
                                                  nData: 12,
                                                  dataUnit: 'weeks',
                                              },
                                          })
                            }
                        />
                        <Chip
                            label="12 Bulan Terakhir"
                            color={isMonthlyData ? 'success' : undefined}
                            onClick={
                                isMonthlyData
                                    ? undefined
                                    : () =>
                                          replace({
                                              query: {
                                                  nData: 12,
                                                  dataUnit: 'months',
                                              },
                                          })
                            }
                        />
                    </ScrollableXBox>

                    {userHasRole(Role.FARMER) && <PalmBunchWeightChart />}
                    {userHasRole(Role.COURIER) && <PalmBunchDeliveryChart />}
                </FlexColumnBox>
            )}
        </AuthLayout>
    )
}

const getXAxisLabel = (dataUnit: string) => {
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

const PalmBunchWeightChart = () => {
    const { user } = useAuth()
    const { query } = useRouter()
    const { dataUnit = 'weeks', nData = 12 } = query

    const { data, isLoading } = useSWR(
        user
            ? [
                  `palm-bunches/farmer/performances/${user?.uuid}`,
                  {
                      nData: nData,
                      dataUnit: dataUnit,
                  },
              ]
            : null,
    )

    return (
        <StatCard title="Bobot Jual TBS" isLoading={isLoading}>
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

const PalmBunchDeliveryChart = () => {
    const { user } = useAuth()
    const { query } = useRouter()
    const { dataUnit = 'weeks', nData = 12 } = query

    const { data, isLoading } = useSWR(
        user
            ? [
                  `palm-bunches/courier/performances/${user.uuid}`,
                  {
                      nData: nData,
                      dataUnit: dataUnit,
                  },
              ]
            : null,
    )

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
