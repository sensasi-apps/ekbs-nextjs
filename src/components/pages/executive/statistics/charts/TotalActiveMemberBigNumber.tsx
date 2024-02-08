import { memo } from 'react'
import BigNumber from '@/components/StatCard/BigNumber'
import formatNumber from '@/utils/formatNumber'

const TotalActiveMemberBigNumber = memo(function TotalActiveMemberBigNumber({
    data,
    isLoading,
}: {
    data?: number
    isLoading: boolean
}) {
    return (
        <BigNumber
            title="Anggota Aktif"
            isLoading={isLoading}
            primary={data ? formatNumber(data) : ''}
            secondary="orang"
        />
    )
})

export default TotalActiveMemberBigNumber
