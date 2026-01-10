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

    const n_term = installment_data?.n_term ?? 0

    const totalInterest =
        payment_method === 'installment'
            ? (spare_part_margins
                  ?.map(sparePartMargin => {
                      const sparePart = spare_parts?.find(
                          sparePart =>
                              sparePart.spare_part_warehouse_id ===
                              sparePartMargin.spare_part_warehouse_id,
                      )

                      const baseRpPerUnit =
                          sparePart?.spare_part_state?.warehouses[0]
                              ?.base_rp_per_unit ??
                          sparePartMargin._base_rp_per_unit ??
                          0

                      if (!sparePart?.qty || !baseRpPerUnit) return 0

                      const marginRate = sparePartMargin.margin_percentage / 100

                      return (
                          sparePart.qty * Math.ceil(baseRpPerUnit * marginRate)
                      )
                  })
                  .reduce((acc, cur) => acc + cur, 0) ?? 0 * n_term)
            : 0

    return {
        totalInterest,
        totalMovementRp,
        totalRp: totalRpWithoutInterest + totalInterest,
        totalRpWithoutInterest,
        totalServiceRp,
    }
}
