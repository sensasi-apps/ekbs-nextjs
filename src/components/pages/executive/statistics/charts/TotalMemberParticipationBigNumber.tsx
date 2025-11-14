import BigNumber from '@/components/stat-card.big-number'
import formatNumber from '@/utils/format-number'

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
                    ? ((currentParticipationTotal / memberTotal) * 100).toFixed(
                          0,
                      ) + ' %'
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
}

export default TotalMemberParticipationBigNumber
