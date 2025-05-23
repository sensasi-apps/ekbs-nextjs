// types
import type { Ymd } from '@/types/DateString'
import type { OnRowClickType } from '@/components/Datatable'
import type { DatatableProps, GetRowData } from '@/components/Datatable/@types'
import type { Transaction } from '@/dataTypes/Transaction'
// vendors
import { Formik } from 'formik'
import { useCallback, useRef, useState, type MutableRefObject } from 'react'
import Chip from '@mui/material/Chip'
import green from '@mui/material/colors/green'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import Datatable, { getNoWrapCellProps, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// local components
import TransactionForm, {
    type FormValuesType,
    transactionToFormValues,
} from './Form'
import { mutate as mutateCashlist } from '../Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'

type CustomTx = Transaction & {
    tag_names: string
    cash_name: string
}

let getRowDataRefGlobal: MutableRefObject<GetRowData<CustomTx> | undefined>

export default function TransactionCrud() {
    const [values, setValues] = useState<FormValuesType>()
    const [status, setStatus] = useState<Transaction>()
    const getRowDataRef = useRef<GetRowData<CustomTx>>()
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
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                download
                getRowDataCallback={fn => (getRowDataRef.current = fn)}
                onRowClick={handleRowClick}
                title="Riwayat Transaksi"
                tableId="transaction-datatable"
            />

            <DialogWithTitle title={dialogTitle} open={isDialogOpen}>
                <Formik
                    enableReinitialize
                    initialValues={values ?? {}}
                    initialStatus={status}
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
                    onReset={() => setIsDialogOpen(false)}
                    component={TransactionForm}
                />
            </DialogWithTitle>

            <Fab
                disabled={isDialogOpen}
                onClick={() => {
                    setValues({
                        at: dayjs().format('YYYY-MM-DD') as Ymd,
                    })
                    setStatus(undefined)
                    setDialogTitle('Transaksi Baru')
                    setIsDialogOpen(true)
                }}
                aria-label="tambah transaksi">
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
        },
    },
    {
        name: 'cash_name',
        label: 'Kas',
        options: {
            searchable: false,
            customBodyRenderLite: dataIndex =>
                getRowDataRefGlobal.current?.(dataIndex)?.['cash_name'],
        },
    },
    {
        name: 'business_unit_name',
        label: 'Unit Bisnis',
        options: {
            searchable: false,
        },
    },
    {
        name: 'tags.name',
        options: {
            sort: false,
            display: 'excluded',
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
            customBodyRenderLite: dataIndex => {
                const value = getRowDataRefGlobal.current?.(dataIndex)?.amount

                return (
                    <span
                        style={{
                            textAlign: 'right',
                            color:
                                typeof value === 'number' && value <= 0
                                    ? 'inherit'
                                    : green[500],
                        }}>
                        {formatNumber(value ?? 0)}
                    </span>
                )
            },
        },
    },
    {
        name: 'desc',
        label: 'Perihal',
        options: {
            sort: false,
        },
    },
    {
        name: 'userActivityLogs.user.name',
        label: 'Oleh',
        options: {
            sort: false,
            customBodyRenderLite: (_, rowIndex) =>
                getRowDataRefGlobal.current?.(rowIndex)?.user_activity_logs?.[0]
                    ?.user.name,
        },
    },
]
