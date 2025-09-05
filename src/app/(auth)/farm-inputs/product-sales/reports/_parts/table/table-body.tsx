// types
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
// vendors
import { memo } from 'react'
import MuiTableBody from '@mui/material/TableBody'
import MuiTableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
// components
import TableRow from './table-row'

function TableBody({ data }: { data: ProductSaleORM[] }) {
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
