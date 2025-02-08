// types
import type { UUID } from 'crypto'
// vendors
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
// components
import Datatable, { DatatableProps } from '@/components/Datatable'
// enums
import ApiUrlEnum from '@/components/PalmBunchesReaPayment/ApiUrlEnum'
// utils
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'

export default function PalmBuncesReaPaymentDetailDatatableModal({
    uuid,
    open,
    title,
    type,
    onClose,
}: {
    uuid?: UUID
    open: boolean
    title: string
    type: 'not-found' | 'unvalidated' | 'unsynced' | 'done'
    onClose: () => unknown
}) {
    return (
        <Dialog open={open} onClose={onClose} fullScreen>
            <DialogContent
                sx={{
                    p: 0,
                }}>
                {uuid && (
                    <Datatable
                        title={title}
                        tableId="PalmBunchReaPaymentDetailDatatable"
                        apiUrl={ApiUrlEnum.REA_PAYMENT_DETAIL_DATATABLE.replace(
                            '$1',
                            uuid,
                        )}
                        apiUrlParams={{
                            type: type,
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{
                            name: 'wb_ticket_no',
                            direction: 'asc',
                        }}
                    />
                )}
            </DialogContent>
            <Button fullWidth onClick={onClose} color="warning">
                <DialogActions
                    sx={{
                        p: 0,
                    }}>
                    Tutup
                </DialogActions>
            </Button>
        </Dialog>
    )
}

const DATATABLE_COLUMNS: DatatableProps['columns'] = [
    {
        name: 'weighting_at',
        label: 'Weighting Date',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        name: 'wb_ticket_no',
        label: 'WB Ticket',
    },
    {
        name: 'vehicle_no',
        label: 'Vehicle NO',
    },
    {
        name: 'ticket_no',
        label: 'Tiket',
    },
    {
        name: 'farmer_name',
        label: 'Farmer Name',
    },

    {
        name: 'gross_bunches',
        label: 'Graded Bunch',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'gross_kg',
        label: 'Mill Weight',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'deduction_kg',
        label: 'Deduction',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'incentive_kg',
        label: 'Incentive',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'net_kg',
        label: 'Net Weight',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'price_rp',
        label: 'Harga',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'gross_rp',
        label: 'Mill Weight',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'deduction_rp',
        label: 'Deduction',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'incentive_rp',
        label: 'Incentive',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'net_rp',
        label: 'Net Weight',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        name: 'status',
        label: 'Keterangan',
        options: {
            searchable: false,
            sort: false,
            customBodyRender: (value: string) => (
                <Typography
                    color={value === 'Lunas' ? 'success.main' : 'warning.main'}
                    variant="body2"
                    component="span">
                    {value}
                </Typography>
            ),
        },
    },
]
