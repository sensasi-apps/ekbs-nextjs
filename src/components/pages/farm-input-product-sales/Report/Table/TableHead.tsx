import { memo } from 'react'
import { TableCell, TableHead as MuiTableHead, TableRow } from '@mui/material'

const LEFT_BORDER_STYLE = {
    borderLeft: '1px solid var(--mui-palette-TableCell-border)',
}

function TableHead() {
    return (
        <MuiTableHead
            sx={{
                '& th': {
                    textAlign: 'center',
                },
            }}>
            <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Gudang</TableCell>
                <TableCell>Pengguna</TableCell>
                <TableCell>Metode Pembayaran</TableCell>
                <TableCell>Barang</TableCell>
                <TableCell>QTY</TableCell>
                <TableCell>Satuan</TableCell>
                <TableCell>Biaya Dasar (Rp)</TableCell>
                <TableCell>Total Biaya Dasar (Rp)</TableCell>
                <TableCell sx={LEFT_BORDER_STYLE}>Harga Jual (Rp)</TableCell>
                <TableCell>Subtotal Penjualan (Rp)</TableCell>
                <TableCell>Penyesuaian/Jasa (Rp)</TableCell>
                <TableCell>Total Penjualan (Rp)</TableCell>
                <TableCell>Marjin (Rp)</TableCell>
            </TableRow>
        </MuiTableHead>
    )
}

export default memo(TableHead)
