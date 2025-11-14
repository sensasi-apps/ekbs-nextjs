'use client'

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipProps } from '@mui/material/Chip'
import { green } from '@mui/material/colors'
import Grid from '@mui/material/Grid'
import Tooltip from '@mui/material/Tooltip'
// vendors
import { Formik } from 'formik'
import { type MutableRefObject, useRef, useState } from 'react'
import useSWR from 'swr'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/charts/lines/in-out'
// components
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import Datatable, { getNoWrapCellProps } from '@/components/Datatable'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import StatCard from '@/components/stat-card'
import BigNumber from '@/components/stat-card.big-number'
// enums
import BusinessUnit from '@/enums/business-unit'
import axios from '@/lib/axios'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
// utils
import formatNumber from '@/utils/format-number'
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import UnitTxForm from './unit-tx-form'

type CustomTx = TransactionORM & {
    tag_names: string
    cash_name: string
    wallet_name: string
    wallet_chip_color: ChipProps['color']
}

let getRowDataRefGlobal: MutableRefObject<GetRowDataType<CustomTx> | undefined>

export default function UnitTxs({
    businessUnit,
}: {
    businessUnit: BusinessUnit
}) {
    const [isOpenDialog, setIsOpenDialog] = useState(false)
    const mutateRef = useRef<MutateType<CustomTx> | undefined>(undefined)
    const getRowDataRef = useRef<GetRowDataType<CustomTx> | undefined>(
        undefined,
    )
    getRowDataRefGlobal = getRowDataRef

    function handleClose() {
        setIsOpenDialog(false)
    }

    const { data, isLoading } = useSWR<{
        balance: number
        receivable: number
        receivable_pass_due: number
        in_out_balance: InOutLineChartProps['data']
    }>(getStatApiUrl(businessUnit))

    return (
        <>
            {businessUnit !== BusinessUnit.BENGKEL && (
                <Grid container mb={1} spacing={1.5}>
                    <Grid
                        display="flex"
                        flexDirection="column"
                        gap={1.5}
                        size={{
                            sm: 4,
                            xs: 12,
                        }}>
                        <BigNumber
                            isLoading={isLoading}
                            primary={
                                <Tooltip
                                    arrow
                                    placement="top"
                                    title={numberToCurrency(
                                        data?.balance ?? 0,
                                    )}>
                                    <Box component="span">
                                        {numberToCurrency(data?.balance ?? 0, {
                                            notation: 'compact',
                                        })}
                                    </Box>
                                </Tooltip>
                            }
                            title="Saldo Unit"
                        />
                    </Grid>

                    <Grid
                        size={{
                            sm: 8,
                            xs: 12,
                        }}>
                        <StatCard
                            isLoading={isLoading}
                            title="Saldo Keluar-Masuk — Bulanan">
                            <InOutLineChart data={data?.in_out_balance} />
                        </StatCard>
                    </Grid>
                </Grid>
            )}

            <Datatable
                apiUrl={`/transactions/${businessUnit}/datatable`}
                columns={
                    businessUnit
                        ? DATATABLE_COLUMNS.filter(
                              col => col.name !== 'cash.name',
                          )
                        : DATATABLE_COLUMNS
                }
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={fn => (mutateRef.current = fn)}
                tableId="transaction-datatable"
                title="Riwayat Transaksi"
            />
            <DialogWithTitle open={isOpenDialog} title="Tambah Transaksi">
                <Formik
                    component={UnitTxForm}
                    initialStatus={{
                        businessUnit: businessUnit,
                    }}
                    initialValues={{}}
                    onReset={handleClose}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `transactions/business-unit/${businessUnit}`,
                                values,
                            )
                            .then(() => {
                                mutateRef.current?.()
                                handleClose()
                            })
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogWithTitle>

            {businessUnit !== BusinessUnit.BENGKEL && (
                <Fab
                    aria-label="Tambah transaksi"
                    disabled={isOpenDialog}
                    onClick={() => setIsOpenDialog(true)}>
                    <PaymentsIcon />
                </Fab>
            )}
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<CustomTx>['columns'] = [
    {
        label: 'UUID',
        name: 'uuid',
        options: {
            display: 'excluded',
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
        label: 'TGL',
        name: 'at',
        options: {
            customBodyRender: toDmy,
            setCellProps: getNoWrapCellProps,
        },
    },
    {
        name: 'cash.name',
        options: {
            display: 'excluded',
            download: false,
        },
    },
    {
        label: 'Kas',
        name: 'cash_name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRefGlobal.current?.(dataIndex)
                const chipColor = (data?.amount ?? 0) > 0 ? 'success' : 'error'

                return data?.cash_name ? (
                    <Chip
                        color={chipColor}
                        label={data?.cash_name}
                        size="small"
                    />
                ) : (
                    ''
                )
            },
            searchable: false,
        },
    },
    {
        label: 'Wallet',
        name: 'wallet_name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRefGlobal.current?.(dataIndex)

                return data?.wallet_name ? (
                    <Chip
                        color={data.wallet_chip_color}
                        label={data.wallet_name}
                        size="small"
                    />
                ) : (
                    ''
                )
            },
            searchable: false,
            sort: false,
        },
    },
    {
        name: 'tags.name',
        options: {
            display: 'excluded',
            download: false,
            sort: false,
        },
    },
    {
        label: 'Akun',
        name: 'tag_names',
        options: {
            customBodyRenderLite: dataIndex => {
                return getRowDataRefGlobal
                    .current?.(dataIndex)
                    ?.['tag_names']?.split(', ')
                    .map(tagName => (
                        <Chip key={tagName} label={tagName} size="small" />
                    ))
            },
            searchable: false,
            sort: false,
        },
    },
    {
        label: 'Nilai (Rp)',
        name: 'amount',
        options: {
            customBodyRender: (value: number) => (
                <span
                    style={{
                        color: value <= 0 ? 'inherit' : green[500],
                        whiteSpace: 'nowrap',
                    }}>
                    {formatNumber(value)}
                </span>
            ),
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
        },
    },
    {
        label: 'Keterangan',
        name: 'desc',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre',
                },
            }),
        },
    },
    {
        label: 'Oleh',
        name: 'userActivityLogs.user.name',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowDataRefGlobal.current?.(dataIndex)
                    ?.user_activity_logs?.[0]?.user.name,
        },
    },
]

function getStatApiUrl(businessUnit: BusinessUnit) {
    switch (businessUnit) {
        case BusinessUnit.SPP:
            return 'user-loans/statistic-data'
            break

        case BusinessUnit.SAPRODI:
            return 'farm-inputs/statistic-data'
            break

        case BusinessUnit.ALAT_BERAT:
            return 'heavy-equipment-rents/statistic-data'
            break

        case BusinessUnit.TBS:
            return 'palm-bunches/statistic-data'
            break

        case BusinessUnit.BENGKEL:
            return null
            break

        default:
            throw new Error('business unit unhandled')
            break
    }
}
