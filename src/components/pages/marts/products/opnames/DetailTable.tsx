import IconButton from '@/components/IconButton'
import NumericFormat from '@/components/NumericFormat'
import ProductMovementDetail from '@/dataTypes/mart/ProductMovementDetail'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
import axios from '@/lib/axios'
import formatNumber from '@/utils/formatNumber'
import { RemoveCircle } from '@mui/icons-material'
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function DetailTable({
    data,
}: {
    data: ProductMovementDetail[]
}) {
    const { refresh } = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleRemove = (id: number) => {
        setIsLoading(true)

        axios
            .delete(
                OpnameApiUrl.REMOVE_PRODUCT.replace('$pmdId', id.toString()),
            )
            .then(() => refresh())
    }

    return (
        <TableContainer>
            <Table
                size="small"
                sx={{
                    whiteSpace: 'nowrap',
                }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell>HPP Satuan</TableCell>
                        <TableCell>QTY Tercatat</TableCell>
                        <TableCell>QTY Fisik</TableCell>
                        <TableCell>Selisih (QTY)</TableCell>
                        <TableCell>Selisih (HPP)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={9} align="center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}

                    {data.map(
                        (
                            {
                                id,
                                product_id,
                                product_state,
                                warehouse_state,
                                qty,
                            },
                            i,
                        ) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <IconButton
                                        disabled={isLoading}
                                        icon={RemoveCircle}
                                        title="Hapus dari opname"
                                        color="error"
                                        onClick={() => handleRemove(id)}
                                        slotProps={{
                                            tooltip: {
                                                placement: 'left',
                                            },
                                        }}
                                    />
                                    {formatNumber(i + 1)}
                                </TableCell>
                                <TableCell>{product_id}</TableCell>
                                <TableCell>
                                    {product_state?.category_name}
                                </TableCell>
                                <TableCell>{product_state?.name}</TableCell>

                                <TableCell align="right">
                                    {warehouse_state?.cost_rp_per_unit
                                        ? formatNumber(
                                              warehouse_state.cost_rp_per_unit,
                                          )
                                        : ''}
                                </TableCell>
                                <TableCell align="right">
                                    {warehouse_state?.qty}
                                </TableCell>
                                <TableCell align="right">
                                    <NumericFormat
                                        value={qty}
                                        margin="none"
                                        inputProps={{
                                            sx: {
                                                width: '4em',
                                                py: 0,
                                                px: 1,
                                                textAlign: 'right',
                                            },
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    {qty - (warehouse_state?.qty ?? 0)}
                                </TableCell>
                                <TableCell align="right">
                                    {(qty - (warehouse_state?.qty ?? 0)) *
                                        (warehouse_state?.cost_rp_per_unit ??
                                            0)}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
