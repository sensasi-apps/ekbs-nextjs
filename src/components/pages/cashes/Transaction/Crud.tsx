// types
import type { Ymd } from '@/types/DateString'
import type { OnRowClickType } from '@/components/Datatable'
import type { DatatableProps, GetRowData } from '@/components/Datatable/@types'
import type Transaction from '@/dataTypes/Transaction'
// vendors
import Chip from '@mui/material/Chip'
import { Formik } from 'formik'
import green from '@mui/material/colors/green'
import { useCallback, useState } from 'react'
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
    FormValuesType,
    transactionToFormValues,
} from './Form'
import { mutate as mutateCashlist } from '../Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import toDmy from '@/utils/toDmy'
import formatNumber from '@/utils/formatNumber'

let getRowData: GetRowData<Transaction>

export default function TransactionCrud() {
    const [values, setValues] = useState<FormValuesType>()
    const [status, setStatus] = useState<Transaction>()

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [dialogTitle, setDialogTitle] = useState<string>('')

    const handleRowClick: OnRowClickType = useCallback((_, rowMeta, event) => {
        if (event.detail === 2) {
            const data = getRowData(rowMeta.dataIndex)

            if (!data) return

            setValues(transactionToFormValues(data))
            setStatus(data)
            setDialogTitle('Ubah Transaksi')
            setIsDialogOpen(true)
        }
    }, [])

    return (
        <>
            <Datatable<Transaction>
                title="Riwayat Transaksi"
                tableId="transaction-datatable"
                apiUrl="/transactions/datatable"
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ name: 'uuid', direction: 'desc' }}
                getRowDataCallback={fn => (getRowData = fn)}
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

const DATATABLE_COLUMNS: DatatableProps<Transaction>['columns'] = [
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
        label: 'Kas',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.cash?.name,
        },
    },
    {
        name: 'tags.name',
        label: 'Akun',
        options: {
            sort: false,
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.tags.map(tag => (
                    <Chip key={tag.id} label={tag.name.id} size="small" />
                )),
        },
    },
    {
        name: 'amount',
        label: 'Nilai (Rp)',
        options: {
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
        label: 'Perihal',
        options: {
            sort: false,
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
            sort: false,
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.user_activity_logs?.[0]?.user.name,
        },
    },
]
