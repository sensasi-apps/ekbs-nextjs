import type SaleFormValues from '../types/sale-form-values'

export default function calculateTotals({
    spare_parts,
    services,
    adjustment_rp,
    installment_data,
    spare_part_margins,
    payment_method,
}: SaleFormValues) {
    const totalMovementRp =
        spare_parts?.reduce(
            (acc, { rp_per_unit, qty }) =>
                acc + (rp_per_unit ?? 0) * (qty ?? 0),
            0,
        ) ?? 0

    const totalServiceRp =
        services?.reduce((acc, { rp }) => acc + (rp ?? 0), 0) ?? 0

    const totalRpWithoutInterest =
        totalMovementRp + totalServiceRp + (adjustment_rp ?? 0)

    const sparePartInterestPercent =
        spare_part_margins?.reduce(
            (acc, { margin_percentage }) =>
                acc + margin_percentage / spare_part_margins.length,
            0,
        ) ?? 0

    const totalInterest =
        payment_method === 'installment'
            ? Math.ceil(
                  totalMovementRp * ((sparePartInterestPercent ?? 0) / 100),
              ) * (installment_data?.n_term ?? 0)
            : 0

    const totalRp = totalRpWithoutInterest + totalInterest

    return {
        totalMovementRp,
        totalServiceRp,
        totalRpWithoutInterest,
        totalInterest,
        totalRp,
    }
}
