import { memo } from 'react'
import BigNumber from '@/components/StatCard/BigNumber'
import formatNumber from '@/utils/format-number'

const TotalMemberParticipationBigNumber = memo(
    function TotalMemberParticipationBigNumber({
        memberTotal,
        currentParticipationTotal,
        isLoading,
    }: {
        memberTotal: number | undefined
        currentParticipationTotal: number | undefined
        isLoading: boolean
    }) {
        return (
            <BigNumber
                isLoading={isLoading}
                primary={
                    !isLoading && memberTotal && currentParticipationTotal
                        ? (
                              (currentParticipationTotal / memberTotal) *
                              100
                          ).toFixed(0) + ' %'
                        : '0 %'
                }
                secondary={
                    !isLoading && memberTotal && currentParticipationTotal
                        ? `${formatNumber(
                              currentParticipationTotal ?? 0,
                          )}/${formatNumber(memberTotal)} org`
                        : '0/' + formatNumber(memberTotal ?? 0) + ' org'
                }
                title="Partisipasi — Bulan Ini"
            />
        )
    },
)

export default TotalMemberParticipationBigNumber
