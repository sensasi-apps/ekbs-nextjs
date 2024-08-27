// types
import ProductSaleType from '@/dataTypes/ProductSale'
// vendors
import { memo } from 'react'
import {
    TableRow as MuiTableRow,
    TableBody as MuiTableBody,
    TableCell,
} from '@mui/material'
// components
import TableRow from './TableRow'

function TableBody({ data }: { data: ProductSaleType[] }) {
    return (
        <MuiTableBody
            sx={{
                '& td': {
                    whiteSpace: 'nowrap',
                },
            }}>
            {data.length === 0 && (
                <MuiTableRow>
                    <TableCell
                        colSpan={15}
                        sx={{
                            textAlign: 'center',
                        }}>
                        Tidak ada data
                    </TableCell>
                </MuiTableRow>
            )}

            {data.map((item, i) => (
                <TableRow key={i} no={i + 1} data={item} />
            ))}
        </MuiTableBody>
    )
}

export default memo(TableBody)
