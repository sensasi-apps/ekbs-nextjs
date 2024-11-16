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
    TableFooter,
    TableHead,
    TableRow,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'

export default function DetailTable({
    data,
    onValueChange,
    disabled,
    finished,
}: {
    finished: boolean
    data: ProductMovementDetail[]
    disabled?: boolean
    onValueChange?: (id: number, value: number) => void
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

    const onValueChangeDebounced = useDebouncedCallback(
        (id: number, value: number) => onValueChange?.(id, value),
        300,
    )

    return (
        <TableContainer>
            <Table
                size="small"
                sx={{
                    '& th, & td': {
                        px: 1,
                    },
                }}>
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Barcode</TableCell>
                        <TableCell>Kategori</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">HPP Satuan</TableCell>
                        <TableCell align="right">QTY Sistem</TableCell>
                        <TableCell align="right">QTY Fisik</TableCell>
                        <TableCell
                            sx={{
                                displayPrint: finished ? undefined : 'none',
                            }}
                            align="right">
                            Selisih (QTY)
                        </TableCell>
                        <TableCell
                            align="right"
                            sx={{
                                displayPrint: finished ? undefined : 'none',
                            }}>
                            Selisih (HPP)
                        </TableCell>
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
                            <TableRow
                                key={i}
                                sx={{
                                    '& > td': {
                                        py: 0.3,
                                    },
                                }}>
                                <TableCell>
                                    {!finished && (
                                        <IconButton
                                            disabled={isLoading || disabled}
                                            icon={RemoveCircle}
                                            title="Hapus dari opname"
                                            color="error"
                                            onClick={() => handleRemove(id)}
                                            tabIndex={-1}
                                            sx={{
                                                displayPrint: 'none',
                                            }}
                                            slotProps={{
                                                tooltip: {
                                                    placement: 'left',
                                                },
                                            }}
                                        />
                                    )}

                                    {formatNumber(i + 1)}
                                </TableCell>
                                <TableCell>
                                    {product_state?.barcode_reg_id}
                                </TableCell>
                                <TableCell>
                                    {product_state?.category_name}
                                </TableCell>
                                <TableCell
                                    sx={{
                                        whiteSpace: 'auto',
                                    }}>
                                    {product_state?.name}
                                </TableCell>

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
                                    {finished ? (
                                        (warehouse_state?.qty ?? 0) + qty
                                    ) : (
                                        <NumericFormat
                                            value={
                                                (warehouse_state?.qty ?? 0) +
                                                qty
                                            }
                                            margin="none"
                                            sx={{
                                                displayPrint: 'none',
                                            }}
                                            disabled={isLoading || disabled}
                                            onValueChange={({ floatValue }) =>
                                                onValueChangeDebounced(
                                                    id,
                                                    floatValue ?? 0,
                                                )
                                            }
                                            inputProps={{
                                                sx: {
                                                    width: '4em',
                                                    py: 0,
                                                    px: 1,
                                                    textAlign: 'right',
                                                },
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        displayPrint: finished
                                            ? undefined
                                            : 'none',
                                    }}>
                                    {formatNumber(qty)}
                                </TableCell>
                                <TableCell
                                    align="right"
                                    sx={{
                                        displayPrint: finished
                                            ? undefined
                                            : 'none',
                                    }}>
                                    {formatNumber(
                                        qty *
                                            (warehouse_state?.cost_rp_per_unit ??
                                                0),
                                    )}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>
                <TableFooter
                    sx={{
                        displayPrint: finished ? undefined : 'none',
                    }}>
                    <TableRow>
                        <TableCell colSpan={8} align="right">
                            TOTAL
                        </TableCell>
                        <TableCell colSpan={9} align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { qty, warehouse_state }) =>
                                        acc +
                                        qty *
                                            (warehouse_state?.cost_rp_per_unit ??
                                                0),
                                    0,
                                ),
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
