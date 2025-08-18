'use client'

// vendors
import { useState } from 'react'
import useSWR from 'swr'
// materials
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
// components
import BigNumberCard from '@/components/big-number-card'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import PageTitle from '@/components/page-title'
import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
//
import type { ProductSale } from '@/dataTypes/ProductSale'
import { type ApiResponseType, LineChartCard } from '@/pages/me/participations'
// utils
import toDmy from '@/utils/to-dmy'
import nowrapMuiDatatableCellPropsFn from '@/utils/nowrap-mui-datatable-cell-props-fn'
import formatNumber from '@/utils/format-number'
import FlexBox from '@/components/flex-box'

let getRowData: GetRowDataType<ProductSale>

export default function Page() {
    const [receiptDialogData, setReceiptDialogData] = useState<ProductSale>()

    const {
        data: { farmInputs: { bigNumber1, bigNumber2, lineChart } } = {
            farmInputs: {},
        },
    } = useSWR<ApiResponseType>('me/participations')

    return (
        <>
            <PageTitle title="Pembelianku" subtitle="SAPRODI" />

            <FlexBox flexDirection="column" gap={2}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: '100%',
                    }}>
                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}>
                        {bigNumber1 && (
                            <BigNumberCard {...bigNumber1} collapsible />
                        )}
                    </Grid>

                    <Grid
                        size={{
                            xs: 12,
                            md: 6,
                        }}>
                        {bigNumber2 && (
                            <BigNumberCard {...bigNumber2} collapsible />
                        )}
                    </Grid>
                </Grid>

                {lineChart && (
                    <div
                        style={{
                            width: '100%',
                        }}>
                        <LineChartCard
                            collapsible
                            suffix={bigNumber1?.number1Suffix}
                            {...lineChart}
                        />
                    </div>
                )}

                <div
                    style={{
                        width: '100%',
                    }}>
                    <Datatable
                        title="Riwayat"
                        tableId="farm-input-my-purchases-table"
                        apiUrl="/farm-inputs/my-purchases/datatable-data"
                        onRowClick={(_, { dataIndex }, event) => {
                            if (event.detail === 2) {
                                const data = getRowData(dataIndex)
                                if (!data) return

                                setReceiptDialogData(data)
                            }
                        }}
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ name: 'at', direction: 'desc' }}
                        getRowDataCallback={fn => (getRowData = fn)}
                    />
                </div>
            </FlexBox>

            <Dialog
                open={Boolean(receiptDialogData)}
                onClose={() => setReceiptDialogData(undefined)}>
                <DialogActions
                    sx={{
                        p: 0,
                    }}>
                    <Button
                        onClick={() => setReceiptDialogData(undefined)}
                        color="warning"
                        fullWidth>
                        Tutup
                    </Button>
                </DialogActions>

                {receiptDialogData && (
                    <DialogContent
                        sx={{
                            pb: 8,
                            pt: 0,
                        }}>
                        <ProductSaleReceipt data={receiptDialogData} />
                    </DialogContent>
                )}
            </Dialog>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<ProductSale>['columns'] = [
    {
        name: 'at',
        label: 'TGL',
        options: {
            setCellProps: nowrapMuiDatatableCellPropsFn,
            customBodyRender: toDmy,
        },
    },
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        name: 'short_uuid',
        label: 'Kode',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        name: 'productMovement.details.product_state',
        label: 'Barang',
        options: {
            sort: false,
            setCellProps: () => ({
                sx: {
                    '& > div': {
                        display: 'flex',
                        gap: 1,
                    },
                    '& .MuiChip-root': {
                        textTransform: 'uppercase',
                        //     fontSize: '0.8rem !important',
                        //     fontFamily: 'monospace !important',
                    },
                },
            }),
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return ''

                return data.product_movement_details.map(
                    ({ id, qty, product_state }) => (
                        <Chip
                            key={id}
                            label={product_state.name + ' (' + qty * -1 + ')'}
                            size="small"
                        />
                    ),
                )
            },
        },
    },
    {
        name: 'total_rp',
        label: 'Total (Rp)',
        options: {
            setCellProps: nowrapMuiDatatableCellPropsFn,
            sort: false,
            searchable: false,
            customBodyRender: value => formatNumber(value ?? 0),
        },
    },

    {
        name: 'payment_method_id',
        label: 'Metode Pembayaran',
        options: {
            sort: false,
            searchable: false,
        },
    },
]
