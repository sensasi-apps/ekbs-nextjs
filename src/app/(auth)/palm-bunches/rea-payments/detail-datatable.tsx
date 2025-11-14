import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import type { UUID } from 'crypto'
import Datatable, { type DatatableProps } from '@/components/Datatable'
import formatNumber from '@/utils/format-number'
import toDmy from '@/utils/to-dmy'

export default function PalmBunchesReaPaymentDetailDatatableModal({
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
        <Dialog fullScreen onClose={onClose} open={open}>
            <DialogContent
                sx={{
                    p: 0,
                }}>
                {uuid && (
                    <Datatable
                        apiUrl={`palm-bunches/rea-payments/${uuid}/detail-datatable`}
                        apiUrlParams={{
                            type: type,
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{
                            direction: 'asc',
                            name: 'wb_ticket_no',
                        }}
                        tableId="PalmBunchReaPaymentDetailDatatable"
                        title={title}
                    />
                )}
            </DialogContent>
            <Button color="warning" fullWidth onClick={onClose}>
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
        label: 'Weighting Date',
        name: 'weighting_at',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'WB Ticket',
        name: 'wb_ticket_no',
    },
    {
        label: 'Vehicle NO',
        name: 'vehicle_no',
    },
    {
        label: 'Tiket',
        name: 'ticket_no',
    },
    {
        label: 'Farmer Name',
        name: 'farmer_name',
    },

    {
        label: 'Graded Bunch',
        name: 'gross_bunches',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Mill Weight',
        name: 'gross_kg',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Deduction',
        name: 'deduction_kg',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Incentive',
        name: 'incentive_kg',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Net Weight',
        name: 'net_kg',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Harga',
        name: 'price_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Mill Weight',
        name: 'gross_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Deduction',
        name: 'deduction_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Incentive',
        name: 'incentive_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Net Weight',
        name: 'net_rp',
        options: {
            customBodyRender: (value: number) => formatNumber(value),
        },
    },
    {
        label: 'Keterangan',
        name: 'status',
        options: {
            customBodyRender: (value: string) => (
                <Typography
                    color={value === 'Lunas' ? 'success.main' : 'warning.main'}
                    component="span"
                    variant="body2">
                    {value}
                </Typography>
            ),
            searchable: false,
            sort: false,
        },
    },
]
