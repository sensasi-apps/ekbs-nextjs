// vendors
import { Formik } from 'formik'
import { useRef, useState, type MutableRefObject } from 'react'
import axios from '@/lib/axios'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Chip, { type ChipProps } from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import { green } from '@mui/material/colors'
import Tooltip from '@mui/material/Tooltip'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
import type { Transaction } from '@/dataTypes/Transaction'
import Datatable, { getNoWrapCellProps } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
import UnitTxForm from './Form'
import BigNumber from '@/components/StatCard/BigNumber'
import StatCard from '@/components/StatCard'
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
// utils
import formatNumber from '@/utils/formatNumber'
import handle422 from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

type CustomTx = Transaction & {
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
    const mutateRef = useRef<MutateType<CustomTx>>()
    const getRowDataRef = useRef<GetRowDataType<CustomTx>>()
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
            <Grid container mb={1} spacing={1.5}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    gap={1.5}
                    size={{
                        xs: 12,
                        sm: 4,
                    }}>
                    <BigNumber
                        title="Saldo Unit"
                        primary={
                            <Tooltip
                                title={numberToCurrency(data?.balance ?? 0)}
                                arrow
                                placement="top">
                                <Box component="span">
                                    {numberToCurrency(data?.balance ?? 0, {
                                        notation: 'compact',
                                    })}
                                </Box>
                            </Tooltip>
                        }
                        isLoading={isLoading}
                    />
                </Grid>

                <Grid
                    size={{
                        xs: 12,
                        sm: 8,
                    }}>
                    <StatCard
                        title="Saldo Keluar-Masuk — Bulanan"
                        isLoading={isLoading}>
                        <InOutLineChart data={data?.in_out_balance} />
                    </StatCard>
                </Grid>
            </Grid>
            <Datatable
                title="Riwayat Transaksi"
                tableId="transaction-datatable"
                apiUrl={`/transactions/${businessUnit}/datatable`}
                columns={
                    businessUnit
                        ? DATATABLE_COLUMNS.filter(
                              col => col.name !== 'cash.name',
                          )
                        : DATATABLE_COLUMNS
                }
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                mutateCallback={fn => (mutateRef.current = fn)}
            />
            <DialogWithTitle title="Tambah Transaksi" open={isOpenDialog}>
                <Formik
                    initialValues={{}}
                    initialStatus={{
                        businessUnit: businessUnit,
                    }}
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
                    onReset={handleClose}
                    component={UnitTxForm}
                />
            </DialogWithTitle>
            <Fab
                onClick={() => setIsOpenDialog(true)}
                disabled={isOpenDialog}
                aria-label="Tambah transaksi">
                <PaymentsIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: DatatableProps<CustomTx>['columns'] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: 'excluded',
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
        name: 'at',
        label: 'TGL',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRender: toDmy,
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
        name: 'cash_name',
        label: 'Kas',
        options: {
            searchable: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRefGlobal.current?.(dataIndex)
                const chipColor = (data?.amount ?? 0) > 0 ? 'success' : 'error'

                return data?.cash_name ? (
                    <Chip
                        label={data?.cash_name}
                        size="small"
                        color={chipColor}
                    />
                ) : (
                    ''
                )
            },
        },
    },
    {
        name: 'wallet_name',
        label: 'Wallet',
        options: {
            searchable: false,
            sort: false,
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRefGlobal.current?.(dataIndex)

                return data?.wallet_name ? (
                    <Chip
                        label={data.wallet_name}
                        size="small"
                        color={data.wallet_chip_color}
                    />
                ) : (
                    ''
                )
            },
        },
    },
    {
        name: 'tags.name',
        options: {
            sort: false,
            display: 'excluded',
            download: false,
        },
    },
    {
        name: 'tag_names',
        label: 'Akun',
        options: {
            sort: false,
            searchable: false,
            customBodyRenderLite: dataIndex => {
                return getRowDataRefGlobal
                    .current?.(dataIndex)
                    ?.['tag_names']?.split(', ')
                    .map(tagName => (
                        <Chip key={tagName} label={tagName} size="small" />
                    ))
            },
        },
    },
    {
        name: 'amount',
        label: 'Nilai (Rp)',
        options: {
            setCellProps: () => ({
                style: {
                    textAlign: 'right',
                },
            }),
            customBodyRender: (value: number) => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        color: value <= 0 ? 'inherit' : green[500],
                    }}>
                    {formatNumber(value)}
                </span>
            ),
        },
    },
    {
        name: 'desc',
        label: 'Keterangan',
        options: {
            setCellProps: () => ({
                style: {
                    whiteSpace: 'pre',
                },
            }),
        },
    },
    {
        name: 'userActivityLogs.user.name',
        label: 'Oleh',
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

        default:
            throw new Error('business unit unhandled')
            break
    }
}
