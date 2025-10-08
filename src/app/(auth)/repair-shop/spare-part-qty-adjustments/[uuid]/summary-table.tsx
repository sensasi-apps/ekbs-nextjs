// vendors
import { useState } from 'react'
import dayjs from 'dayjs'
// materials
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
// components
import UserDisplay from '@/components/user-display'
// icons-materials
import Edit from '@mui/icons-material/Edit'
// utils
import formatNumber from '@/utils/format-number'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
import SparePartQtyAdjustmentFormDialog, {
    type CreateFormValues,
} from '../spare-part-qty-adjustment-form-dialog'
// modules

export default function SummaryTable({
    data,
    handleRefreshData,
}: {
    data: SparePartMovementORM
    handleRefreshData?: () => void
}) {
    if (data.created_by_user === undefined) {
        throw new Error('created_by_user is null')
    }

    const rpTotalMovementMinusQty = data.details.reduce(
        (acc, { qty, spare_part_state: { warehouses } }) =>
            acc + (qty < 0 ? qty * warehouses[0].base_rp_per_unit : 0),
        0,
    )

    const rpTotalMovementPlusQty = data.details.reduce(
        (acc, { qty, spare_part_state: { warehouses } }) =>
            acc + (qty > 0 ? qty * warehouses[0].base_rp_per_unit : 0),
        0,
    )

    return (
        <Table
            size="small"
            sx={{
                width: 'unset',
                '& td': {
                    py: 0.3,
                    borderBottom: 'unset',
                },
            }}>
            <TableBody>
                <TableRow>
                    <TableCell>Kode</TableCell>
                    <ColonCell />
                    <TableCell>{data.short_uuid}</TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Tanggal</TableCell>
                    <ColonCell />
                    <TableCell>
                        {dayjs(data.at).format('DD MMMM YYYY')}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Dibuat oleh</TableCell>
                    <ColonCell />
                    <TableCell>
                        <UserDisplay data={data.created_by_user} />
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Nilai Ditemukan</TableCell>
                    <ColonCell />
                    <TableCell>
                        Rp {formatNumber(rpTotalMovementPlusQty)}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Nilai Hilang</TableCell>
                    <ColonCell />
                    <TableCell>
                        Rp {formatNumber(rpTotalMovementMinusQty)}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Total Selisih</TableCell>
                    <ColonCell />
                    <TableCell>
                        Rp{' '}
                        {formatNumber(
                            rpTotalMovementPlusQty - rpTotalMovementMinusQty,
                        )}
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell>Catatan</TableCell>
                    <ColonCell />
                    <TableCell>
                        {data.note}

                        <EditOpnameInfo
                            data={data}
                            handleRefreshData={handleRefreshData}
                        />
                    </TableCell>
                </TableRow>
            </TableBody>
        </Table>
    )
}

function ColonCell() {
    return <TableCell sx={{ px: 0 }}>:</TableCell>
}

function EditOpnameInfo({
    data,
    handleRefreshData,
}: {
    data: SparePartMovementORM
    handleRefreshData?: () => void
}) {
    const [formValues, setFormValues] = useState<CreateFormValues>()

    function handleClose() {
        setFormValues(undefined)
    }

    return (
        <>
            <IconButton
                size="small"
                sx={{
                    ml: 1,
                }}
                onClick={() => setFormValues({ at: data.at, note: data.note })}>
                <Edit />
            </IconButton>

            <SparePartQtyAdjustmentFormDialog
                formValues={formValues}
                selectedRow={data}
                onSubmitted={() => {
                    setFormValues(undefined)
                    handleRefreshData?.()
                }}
                onClose={handleClose}
            />
        </>
    )
}
