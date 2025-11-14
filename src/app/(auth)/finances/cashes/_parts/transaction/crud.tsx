// types

// icons
import PaymentsIcon from '@mui/icons-material/Payments'
import Chip, { type ChipProps } from '@mui/material/Chip'
import { green } from '@mui/material/colors'
import dayjs from 'dayjs'
// vendors
import { Formik } from 'formik'
import { type MutableRefObject, useCallback, useRef, useState } from 'react'
import type { OnRowClickType } from '@/components/Datatable'
// components
import Datatable, { getNoWrapCellProps, mutate } from '@/components/Datatable'
import type { DatatableProps, GetRowData } from '@/components/Datatable/@types'
import DialogWithTitle from '@/components/dialog-with-title'
import Fab from '@/components/fab'
import axios from '@/lib/axios'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
import type { Ymd } from '@/types/date-string'
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

let getRowDataRefGlobal: MutableRefObject<GetRowData<CustomTx> | undefined>

export default function TransactionCrud() {
    const [values, setValues] = useState<FormValuesType>()
    const [status, setStatus] = useState<TransactionORM>()
    const getRowDataRef = useRef<GetRowData<CustomTx> | undefined>(undefined)
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
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'at' }}
                download
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
        label: 'Kas',
        name: 'cash_name',
        options: {
            customBodyRenderLite: dataIndex => {
                const data = getRowDataRefGlobal.current?.(dataIndex)
                const chipColor = (data?.amount ?? 0) > 0 ? 'success' : 'error'

                if (!data) return ''

                return (
                    <Chip
                        color={chipColor}
                        label={data?.cash_name}
                        size="small"
                    />
                )
            },
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
                        color={data?.wallet_chip_color}
                        label={data?.wallet_name}
                        size="small"
                    />
                ) : (
                    ''
                )
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
                        <Chip key={tagName} label={tagName} size="small" />
                    ))
            },
            sort: false,
        },
    },
    {
        label: 'Nilai (Rp)',
        name: 'amount',
        options: {
            customBodyRenderLite: dataIndex => {
                const value = getRowDataRefGlobal.current?.(dataIndex)?.amount

                return (
                    <span
                        style={{
                            color:
                                typeof value === 'number' && value <= 0
                                    ? 'inherit'
                                    : green[500],
                            textAlign: 'right',
                        }}>
                        {formatNumber(value ?? 0)}
                    </span>
                )
            },
        },
    },
    {
        label: 'Perihal',
        name: 'desc',
        options: {
            sort: false,
        },
    },
    {
        label: 'Oleh',
        name: 'userActivityLogs.user.name',
        options: {
            customBodyRenderLite: (_, rowIndex) =>
                getRowDataRefGlobal.current?.(rowIndex)?.user_activity_logs?.[0]
                    ?.user.name,
            sort: false,
        },
    },
]
