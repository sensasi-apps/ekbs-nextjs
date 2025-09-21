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

    const totalInterest =
        payment_method === 'installment'
            ? (spare_part_margins
                  ?.map(({ margin_percentage, spare_part_warehouse_id }) => {
                      const sparePart = spare_parts?.find(
                          sparePart =>
                              sparePart.spare_part_warehouse_id ===
                              spare_part_warehouse_id,
                      )

                      if (!sparePart?.qty || !sparePart?.rp_per_unit) return 0

                      const marginRate = margin_percentage / 100

                      return sparePart.qty * sparePart.rp_per_unit * marginRate
                  })
                  .reduce((acc, cur) => acc + cur, 0) ?? 0) *
              installment_data.n_term
            : 0

    const totalRp = Math.ceil(totalRpWithoutInterest + totalInterest)

    return {
        totalMovementRp,
        totalServiceRp,
        totalRpWithoutInterest,
        totalInterest,
        totalRp,
    }
}
