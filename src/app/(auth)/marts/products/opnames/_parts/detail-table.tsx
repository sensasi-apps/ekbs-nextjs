// vendors

// icons-materials
import RemoveCircle from '@mui/icons-material/RemoveCircle'
// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import IconButton from '@/components/icon-button'
import NumericFormat from '@/components/NumericFormat'
import axios from '@/lib/axios'
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
//
import type ProductMovementDetail from '@/modules/mart/types/orms/product-movement-detail'
import formatNumber from '@/utils/format-number'

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
                            align="right"
                            sx={{
                                displayPrint: finished ? undefined : 'none',
                            }}>
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
                            <TableCell align="center" colSpan={9}>
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}

                    {data.map(
                        ({ id, product_state, warehouse_state, qty }, i) => (
                            <TableRow
                                key={id}
                                sx={{
                                    '& > td': {
                                        py: 0.3,
                                    },
                                }}>
                                <TableCell>
                                    {!finished && (
                                        <IconButton
                                            color="error"
                                            disabled={isLoading || disabled}
                                            icon={RemoveCircle}
                                            onClick={() => handleRemove(id)}
                                            slotProps={{
                                                tooltip: {
                                                    placement: 'left',
                                                },
                                            }}
                                            sx={{
                                                displayPrint: 'none',
                                            }}
                                            tabIndex={-1}
                                            title="Hapus dari opname"
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
                                            disabled={isLoading || disabled}
                                            inputProps={{
                                                sx: {
                                                    px: 1,
                                                    py: 0,
                                                    textAlign: 'right',
                                                    width: '4em',
                                                },
                                            }}
                                            margin="none"
                                            onValueChange={({ floatValue }) =>
                                                onValueChangeDebounced(
                                                    id,
                                                    floatValue ?? 0,
                                                )
                                            }
                                            sx={{
                                                displayPrint: 'none',
                                            }}
                                            value={
                                                (warehouse_state?.qty ?? 0) +
                                                qty
                                            }
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
                        <TableCell align="right" colSpan={5}>
                            TOTAL
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { warehouse_state }) =>
                                        acc + (warehouse_state?.qty ?? 0),
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { qty, warehouse_state }) =>
                                        acc + qty + (warehouse_state?.qty ?? 0),
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce((acc, { qty }) => acc + qty, 0),
                            )}
                        </TableCell>

                        <TableCell align="right">
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
