import useSWR from 'swr'
import TbsPerformanceChart from '../TbsPerformanceChart'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function TbsPerformanceChartWithAutoFetch({
    data,
    userUuid,
    frequency = 'weekly',
    nFrequency = 12,
}: {
    data?: []
    userUuid: string
    frequency?: 'weekly' | 'monthly'
    nFrequency?: number
}) {
    const { data: fetchData, isLoading } = useSWR(
        !data && userUuid
            ? `/users/${userUuid}/performances/${frequency}/${nFrequency}`
            : null,
    )

    const chartData = data || fetchData

    return (
        <>
            <LoadingCenter isShow={isLoading} />

            {chartData && <TbsPerformanceChart data={data || fetchData} />}

            {!chartData && !isLoading && (
                <i>Terjadi kesalahan, data tidak dapat ditampilkan</i>
            )}
        </>
    )
}
