import useSWR from 'swr'
import TbsPerformanceChart from '../TbsPerformanceChart'
import LoadingCenter from '@/components/Statuses/LoadingCenter'

export default function TbsPerformanceChartWithAutoFetch({
    data,
    userUuid,
}: {
    data?: []
    userUuid: string
}) {
    const { data: fetchData, isLoading } = useSWR(
        !data && userUuid ? `/users/${userUuid}/tbs-performances` : null,
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
