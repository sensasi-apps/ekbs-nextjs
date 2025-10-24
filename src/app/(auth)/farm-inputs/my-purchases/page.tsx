'use client'

// materials
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import Grid from '@mui/material/Grid'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import type ApiResponseType from '@/app/(auth)/me/participation/api-response-type'
// components
import BigNumberCard from '@/components/big-number-card'
import Datatable, {
    type DatatableProps,
    type GetRowDataType,
} from '@/components/Datatable'
import FlexBox from '@/components/flex-box'
import LineChartCard from '@/components/line-chart-card'
import PageTitle from '@/components/page-title'
import ProductSaleReceipt from '@/components/pages/farm-input-product-sales/Receipt'
//
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import formatNumber from '@/utils/format-number'
import nowrapMuiDatatableCellPropsFn from '@/utils/nowrap-mui-datatable-cell-props-fn'
// utils
import toDmy from '@/utils/to-dmy'

let getRowData: GetRowDataType<ProductSaleORM>

export default function Page() {
    const [receiptDialogData, setReceiptDialogData] = useState<ProductSaleORM>()

    const {
        data: {
            farmInputs: { bigNumber1, bigNumber2, lineChart },
        } = {
            farmInputs: {},
        },
    } = useSWR<ApiResponseType>('me/participations')

    return (
        <>
            <PageTitle subtitle="SAPRODI" title="Pembelianku" />

            <FlexBox flexDirection="column" gap={2}>
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: '100%',
                    }}>
                    <Grid
                        size={{
                            md: 6,
                            xs: 12,
                        }}>
                        {bigNumber1 && (
                            <BigNumberCard {...bigNumber1} collapsible />
                        )}
                    </Grid>

                    <Grid
                        size={{
                            md: 6,
                            xs: 12,
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
                        apiUrl="/farm-inputs/my-purchases/datatable-data"
                        columns={DATATABLE_COLUMNS}
                        defaultSortOrder={{ direction: 'desc', name: 'at' }}
                        getRowDataCallback={fn => {
                            getRowData = fn
                        }}
                        onRowClick={(_, { dataIndex }, event) => {
                            if (event.detail === 2) {
                                const data = getRowData(dataIndex)
                                if (!data) return

                                setReceiptDialogData(data)
                            }
                        }}
                        tableId="farm-input-my-purchases-table"
                        title="Riwayat"
                    />
                </div>
            </FlexBox>

            <Dialog
                onClose={() => setReceiptDialogData(undefined)}
                open={Boolean(receiptDialogData)}>
                <DialogActions
                    sx={{
                        p: 0,
                    }}>
                    <Button
                        color="warning"
                        fullWidth
                        onClick={() => setReceiptDialogData(undefined)}>
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

const DATATABLE_COLUMNS: DatatableProps<ProductSaleORM>['columns'] = [
    {
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: toDmy,
            setCellProps: nowrapMuiDatatableCellPropsFn,
        },
    },
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: 'excluded',
            sort: false,
        },
    },
    {
        label: 'Kode',
        name: 'short_uuid',
        options: {
            searchable: false,
            sort: false,
        },
    },

    {
        label: 'Barang',
        name: 'productMovement.details.product_state',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowData(dataIndex)
                if (!data) return ''

                return data.product_movement_details.map(
                    ({ id, qty, product_state }) => (
                        <Chip
                            key={id}
                            label={`${product_state.name} (${qty * -1})`}
                            size="small"
                        />
                    ),
                )
            },
            setCellProps: () => ({
                sx: {
                    '& .MuiChip-root': {
                        textTransform: 'uppercase',
                        //     fontSize: '0.8rem !important',
                        //     fontFamily: 'monospace !important',
                    },
                    '& > div': {
                        display: 'flex',
                        gap: 1,
                    },
                },
            }),
            sort: false,
        },
    },
    {
        label: 'Total (Rp)',
        name: 'total_rp',
        options: {
            customBodyRender: value => formatNumber(value ?? 0),
            searchable: false,
            setCellProps: nowrapMuiDatatableCellPropsFn,
            sort: false,
        },
    },

    {
        label: 'Metode Pembayaran',
        name: 'payment_method_id',
        options: {
            searchable: false,
            sort: false,
        },
    },
]
