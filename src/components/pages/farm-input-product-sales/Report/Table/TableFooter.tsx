import { memo } from 'react'
import {
    TableCell,
    TableFooter as MuiTableFooter,
    TableRow,
} from '@mui/material'
import globalFormatNumber from '@/utils/formatNumber'
import ProductSaleType from '@/dataTypes/ProductSale'
import ChipSmall from '@/components/ChipSmall'

const LEFT_BORDER_STYLE = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

function TableFooter({ data }: { data: ProductSaleType[] }) {
    const baseCostTotalRp = data.reduce(
        (acc, row) =>
            acc +
            row.product_movement_details.reduce(
                (acc, pmd) =>
                    acc +
                    Math.abs(pmd.qty) *
                        pmd.product_warehouse_state.base_cost_rp_per_unit,
                0,
            ),
        0,
    )

    const baseSaleTotalRp = data.reduce(
        (acc, row) => acc + row.total_base_rp,
        0,
    )

    const saleTotalRp = data.reduce((acc, row) => acc + row.total_rp, 0)

    const ajustedTotalRp = saleTotalRp - baseSaleTotalRp

    const marginTotalRp = saleTotalRp - baseCostTotalRp

    const marginTotalPercentage = (marginTotalRp / saleTotalRp) * 100

    return (
        <MuiTableFooter>
            <TableRow
                sx={{
                    '& td': {
                        whiteSpace: 'nowrap',
                    },
                }}>
                <TableCell colSpan={9}>GRAND TOTAL</TableCell>

                <TableCell align="right">
                    {formatNumber(baseCostTotalRp)}
                </TableCell>

                <TableCell sx={LEFT_BORDER_STYLE} />

                <TableCell align="right">
                    {formatNumber(baseSaleTotalRp)}
                </TableCell>

                <TableCell align="right">
                    {formatNumber(ajustedTotalRp)}
                </TableCell>

                <TableCell align="right">{formatNumber(saleTotalRp)}</TableCell>

                <TableCell align="right">
                    {formatNumber(marginTotalRp)}

                    <ChipSmall
                        sx={{ ml: 2 }}
                        color={
                            isNaN(marginTotalPercentage)
                                ? undefined
                                : marginTotalPercentage >= 7
                                  ? 'success'
                                  : 'warning'
                        }
                        variant="outlined"
                        label={
                            (isNaN(marginTotalPercentage)
                                ? 0
                                : formatNumber(marginTotalPercentage)) + '%'
                        }
                    />
                </TableCell>
            </TableRow>
        </MuiTableFooter>
    )
}

export default memo(TableFooter)

function formatNumber(number: number) {
    return globalFormatNumber(number, {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
    })
}
