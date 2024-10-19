import ChipSmall from '@/components/ChipSmall'
import ProductSaleType from '@/dataTypes/ProductSale'
import globalFormatNumber from '@/utils/formatNumber'
import toDmy from '@/utils/toDmy'
import ucWords from '@/utils/ucWords'
import { TableCell, TableRow as MuiTableRow } from '@mui/material'
import { memo, ReactNode } from 'react'

const LEFT_BORDER_STYLE = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

function TableRow({
    data: {
        product_movement_details,
        product_movement,
        at,
        buyer_user,
        payment_method_id,
        total_base_rp,
        total_rp,
    },
    no,
}: {
    data: ProductSaleType
    no: number
}) {
    const totalBaseCostRp = product_movement_details.reduce(
        (acc, pmd) =>
            acc +
            Math.abs(pmd.qty) *
                pmd.product_warehouse_state.base_cost_rp_per_unit,
        0,
    )

    const adjustedTotalRp = total_rp - total_base_rp

    const marginRp = total_rp - totalBaseCostRp
    const marginPercentage = (marginRp / totalBaseCostRp) * 100

    return (
        <MuiTableRow>
            <TableCell>{no}</TableCell>
            <TableCell>{toDmy(at)}</TableCell>
            <TableCell>{ucWords(product_movement.warehouse)}</TableCell>

            <TableCell>{buyer_user ? buyer_user.id : '-'}</TableCell>

            <TableCell>{buyer_user ? buyer_user.name : '-'}</TableCell>

            <TableCell>{payment_method_id}</TableCell>

            <TableCell>
                <Ul>
                    {product_movement_details.map(
                        ({ product_state: { name } }, i) => (
                            <li key={i}>{name}</li>
                        ),
                    )}
                </Ul>
            </TableCell>

            <TableCell align="right">
                <Ul>
                    {product_movement_details.map(({ qty }, i) => (
                        <li key={i}>{formatNumber(Math.abs(qty))}</li>
                    ))}
                </Ul>
            </TableCell>

            <TableCell>
                <Ul>
                    {product_movement_details.map(
                        ({ product_state: { unit } }, i) => (
                            <li key={i}>{unit}</li>
                        ),
                    )}
                </Ul>
            </TableCell>

            <TableCell align="right">
                <Ul>
                    {product_movement_details.map(
                        (
                            {
                                product_warehouse_state: {
                                    base_cost_rp_per_unit,
                                },
                            },
                            i,
                        ) => (
                            <li key={i}>
                                {formatNumber(base_cost_rp_per_unit)}
                            </li>
                        ),
                    )}
                </Ul>
            </TableCell>

            <TableCell align="right">{formatNumber(totalBaseCostRp)}</TableCell>

            <TableCell sx={LEFT_BORDER_STYLE}>
                <Ul>
                    {product_movement_details.map(({ rp_per_unit }, i) => (
                        <li key={i}>{formatNumber(rp_per_unit)}</li>
                    ))}
                </Ul>
            </TableCell>

            <TableCell align="right">{formatNumber(total_base_rp)}</TableCell>

            <TableCell align="right">
                {adjustedTotalRp ? formatNumber(adjustedTotalRp) : ''}
            </TableCell>

            <TableCell align="right">{formatNumber(total_rp)}</TableCell>

            <TableCell align="right">
                {formatNumber(marginRp)}

                <ChipSmall
                    sx={{ ml: 2 }}
                    color={marginPercentage >= 7 ? 'success' : 'warning'}
                    variant="outlined"
                    label={formatNumber(marginPercentage) + '%'}
                />
            </TableCell>
        </MuiTableRow>
    )
}

export default memo(TableRow)

function Ul({ children }: { children: ReactNode }) {
    return (
        <ul
            style={{
                margin: 0,
                paddingLeft: '1em',
                whiteSpace: 'nowrap',
            }}>
            {children}
        </ul>
    )
}

function formatNumber(number: number) {
    return globalFormatNumber(number, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
}
