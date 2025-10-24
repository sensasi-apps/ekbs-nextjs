// types

// vendors
import MuiTableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import MuiTableRow from '@mui/material/TableRow'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
// components
import TableRow from './table-row'

export default function TableBody({ data }: { data: ProductSaleORM[] }) {
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
                <TableRow data={item} key={item.uuid} no={i + 1} />
            ))}
        </MuiTableBody>
    )
}
