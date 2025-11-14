import BigNumber from '@/components/stat-card.big-number'
import formatNumber from '@/utils/format-number'

function TotalActiveMemberBigNumber({
    data,
    isLoading,
}: {
    data?: number
    isLoading: boolean
}) {
    return (
        <BigNumber
            isLoading={isLoading}
            primary={data ? formatNumber(data) : ''}
            secondary="orang"
            title="Anggota Aktif"
        />
    )
}

export default TotalActiveMemberBigNumber
