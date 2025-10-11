// vendors

// materials
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { UUID } from 'crypto'
import { memo } from 'react'
import { validate } from 'uuid'
import NumericField from '@/components/formik-fields/numeric-field'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
import formatNumber from '@/utils/format-number'
import shortUuid from '@/utils/short-uuid'

export default function DetailTable({
    data,
    finished,
    print,
}: {
    finished: boolean
    data: SparePartMovementORM['details']
    print: boolean
}) {
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
                        <TableCell>Kode</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">HPP Satuan</TableCell>
                        <TableCell align="right">QTY Sistem</TableCell>
                        <TableCell align="right">QTY Fisik</TableCell>

                        {finished && (
                            <>
                                <TableCell align="right">
                                    Selisih (QTY)
                                </TableCell>

                                <TableCell align="right">
                                    Selisih (HPP)
                                </TableCell>
                            </>
                        )}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell align="center" colSpan={8}>
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}

                    {data.map((row, index) => (
                        <DetailRow
                            data={row}
                            finished={finished}
                            index={index}
                            key={row.id}
                            print={print}
                            // setDetailQuantities={setDetailQuantities}
                        />
                    ))}
                </TableBody>

                {finished && <Footer data={data} />}
            </Table>
        </TableContainer>
    )
}

function Footer({ data }: { data: SparePartMovementORM['details'] }) {
    const totalRpDiff = data.reduce(
        (
            acc,
            {
                qty,
                spare_part_state: {
                    warehouses: [{ base_rp_per_unit }],
                },
            },
        ) => acc + qty * (base_rp_per_unit ?? 0),
        0,
    )

    return (
        <TableFooter>
            <TableRow>
                <TableCell align="right" colSpan={7}>
                    TOTAL
                </TableCell>

                <TableCell align="right">{formatNumber(totalRpDiff)}</TableCell>
            </TableRow>
        </TableFooter>
    )
}

const DetailRow = memo(function DetailRow({
    index,
    data,
    finished,
    print,
}: {
    index: number
    data: SparePartMovementORM['details'][number]
    finished: boolean
    print: boolean
}) {
    const { qty, spare_part_state } = data
    const warehouseState = spare_part_state.warehouses[0]

    const displayCode = validate(spare_part_state.code)
        ? shortUuid(spare_part_state.code as UUID)
        : spare_part_state.code

    return (
        <TableRow
            sx={{
                '& > td': {
                    py: 0.3,
                },
            }}>
            <TableCell>{formatNumber(index + 1)}</TableCell>
            <TableCell>{displayCode}</TableCell>
            <TableCell>{spare_part_state.name}</TableCell>
            <TableCell align="right">
                {formatNumber(warehouseState.base_rp_per_unit)}
            </TableCell>
            <TableCell align="right">{warehouseState.qty}</TableCell>

            <TableCell align="right">
                {finished || print ? (
                    finished && warehouseState.qty + qty
                ) : (
                    <NumericField
                        name={`${index}.physical_qty`}
                        numericFormatProps={{
                            inputProps: {
                                sx: {
                                    textAlign: 'end !important',
                                },
                            },
                            margin: 'none',

                            slotProps: {
                                input: {
                                    sx: {
                                        minWidth: '5em',
                                        p: 0,
                                    },
                                },
                            },
                            sx: {
                                displayPrint: 'none',
                            },
                        }}
                    />
                )}
            </TableCell>

            {finished && (
                <CalcCells
                    movementQty={qty}
                    warehouseRp={warehouseState.base_rp_per_unit}
                />
            )}
        </TableRow>
    )
})

function CalcCells({
    movementQty,
    warehouseRp,
}: {
    movementQty: number
    warehouseRp: number
}) {
    const qtyDiff = movementQty
    const rpDiff = qtyDiff * warehouseRp

    return (
        <>
            <TableCell align="right">{formatNumber(qtyDiff)}</TableCell>
            <TableCell align="right">{formatNumber(rpDiff)}</TableCell>
        </>
    )
}
