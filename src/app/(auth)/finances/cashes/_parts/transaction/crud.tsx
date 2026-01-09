// types

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
import Chip, { type ChipProps } from '@mui/material/Chip'
import { green } from '@mui/material/colors'
import dayjs from 'dayjs'
// vendors
import { Formik } from 'formik'
import { type MutableRefObject, useCallback, useRef, useState } from 'react'
import useSWR from 'swr'
import type { GetRowDataType, OnRowClickType } from '@/components/data-table'
// components
import Datatable, { getNoWrapCellProps, mutate } from '@/components/data-table'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import axios from '@/lib/axios'
import TransactionTag from '@/modules/transaction/enums/transaction-tag'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'
import type BusinessUnitCashORM from '@/types/orms/business-unit-cash'
import type CashORM from '@/types/orms/cash'
import formatNumber from '@/utils/format-number'
// utils
import errorCatcher from '@/utils/handle-422'
import toDmy from '@/utils/to-dmy'
import { mutate as mutateCashlist } from '../cash/list'
// local components
import TransactionForm, {
    type FormValuesType,
    transactionToFormValues,
} from './form'

type CustomTx = TransactionORM & {
    tag_names: string
    cash_name: string
    wallet_name: string
    wallet_chip_color: ChipProps['color']
}

let getRowDataRefGlobal: MutableRefObject<GetRowDataType<CustomTx> | undefined>

export default function TransactionCrud() {
    const { data: cashes } = useSWR<CashORM[]>('/data/cashes')
    const { data: businessCashes } = useSWR<BusinessUnitCashORM[]>(
        '/data/business-unit-cashes',
    )
    const [values, setValues] = useState<FormValuesType>()
    const [status, setStatus] = useState<TransactionORM>()
    const getRowDataRef = useRef<GetRowDataType<CustomTx> | undefined>(
        undefined,
    )
    getRowDataRefGlobal = getRowDataRef

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [dialogTitle, setDialogTitle] = useState<string>('')

    const handleRowClick: OnRowClickType = useCallback((_, rowMeta, event) => {
        if (event.detail === 2) {
            const data = getRowDataRef.current?.(rowMeta.dataIndex)

            if (!data) return

            setValues(transactionToFormValues(data))
            setStatus(data)
            setDialogTitle('Ubah Transaksi')
            setIsDialogOpen(true)
        }
    }, [])

    return (
        <>
            <Datatable<CustomTx>
                apiUrl="/transactions/datatable"
                columns={[
                    {
                        label: 'UUID',
                        name: 'uuid',
                        options: {
                            display: 'excluded',
                            filter: false,
                        },
                    },
                    {
                        label: 'Kode',
                        name: 'short_uuid',
                        options: {
                            filter: false,
                            searchable: false,
                            sort: false,
                        },
                    },
                    {
                        label: 'TGL',
                        name: 'at',
                        options: {
                            customBodyRender: toDmy,
                            filter: false,
                            setCellProps: getNoWrapCellProps,
                        },
                    },

                    {
                        label: 'Kas',
                        name: 'cash_name',
                        options: {
                            customBodyRenderLite: dataIndex => {
                                const data =
                                    getRowDataRefGlobal.current?.(dataIndex)
                                const chipColor =
                                    (data?.amount ?? 0) > 0
                                        ? 'success'
                                        : 'error'

                                if (!data) return ''

                                return (
                                    <Chip
                                        color={chipColor}
                                        label={data?.cash_name}
                                        size="small"
                                    />
                                )
                            },
                            filterOptions: {
                                names: cashes?.map(cash => cash.name).sort(),
                            },
                        },
                    },
                    {
                        label: 'Wallet',
                        name: 'wallet_name',
                        options: {
                            customBodyRenderLite: dataIndex => {
                                const data =
                                    getRowDataRefGlobal.current?.(dataIndex)

                                return data?.wallet_name ? (
                                    <Chip
                                        color={data?.wallet_chip_color}
                                        label={data?.wallet_name}
                                        size="small"
                                    />
                                ) : (
                                    ''
                                )
                            },
                            filterOptions: {
                                names: businessCashes
                                    ?.map(
                                        businessCash =>
                                            businessCash.business_unit?.name ??
                                            '',
                                    )
                                    .filter(name => !!name)
                                    .sort(),
                            },
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
                                        <Chip
                                            key={tagName}
                                            label={tagName}
                                            size="small"
                                        />
                                    ))
                                    .sort()
                            },
                            filterOptions: {
                                names: Object.values(TransactionTag).sort(),
                            },
                            sort: false,
                        },
                    },
                    {
                        label: 'Nilai (Rp)',
                        name: 'amount',
                        options: {
                            customBodyRenderLite: dataIndex => {
                                const value =
                                    getRowDataRefGlobal.current?.(
                                        dataIndex,
                                    )?.amount

                                return (
                                    <span
                                        style={{
                                            color:
                                                typeof value === 'number' &&
                                                value <= 0
                                                    ? 'inherit'
                                                    : green[500],
                                            textAlign: 'right',
                                        }}>
                                        {formatNumber(value ?? 0)}
                                    </span>
                                )
                            },
                            filter: false,
                        },
                    },
                    {
                        label: 'Perihal',
                        name: 'desc',
                        options: {
                            filter: false,
                            sort: false,
                        },
                    },
                    {
                        label: 'Oleh',
                        name: 'userActivityLogs.user.name',
                        options: {
                            customBodyRenderLite: (_, rowIndex) =>
                                getRowDataRefGlobal.current?.(rowIndex)
                                    ?.user_activity_logs?.[0]?.user.name,
                            filter: false,
                            sort: false,
                        },
                    },
                ]}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                download
                filter
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                onRowClick={handleRowClick}
                tableId="transaction-datatable"
                title="Riwayat Transaksi"
            />

            <DialogWithTitle open={isDialogOpen} title={dialogTitle}>
                <Formik
                    component={TransactionForm}
                    enableReinitialize
                    initialStatus={status}
                    initialValues={values ?? {}}
                    onReset={() => setIsDialogOpen(false)}
                    onSubmit={(values, { setErrors }) =>
                        axios
                            .post(
                                `transactions${status?.uuid ? '/' + status.uuid : ''}`,
                                values,
                            )
                            .then(() => {
                                mutate()
                                mutateCashlist()
                                setIsDialogOpen(false)
                            })
                            .catch(error => errorCatcher(error, setErrors))
                    }
                />
            </DialogWithTitle>

            <Fab
                aria-label="tambah transaksi"
                disabled={isDialogOpen}
                onClick={() => {
                    setValues({
                        at: dayjs().format('YYYY-MM-DD') as Ymd,
                    })
                    setStatus(undefined)
                    setDialogTitle('Transaksi Baru')
                    setIsDialogOpen(true)
                }}>
                <PaymentsIcon />
            </Fab>
        </>
    )
}
