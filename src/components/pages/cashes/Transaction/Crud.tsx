// types
import type TransactionType from '@/dataTypes/Transaction'
import type { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
import type { FormikConfig } from 'formik'
import type { OnRowClickType } from '@/components/Datatable'
// vendors
import { useCallback, useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// materials
import green from '@mui/material/colors/green'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import Datatable, { getNoWrapCellProps, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// local components
import TransactionForm, { INITIAL_VALUES, TransactionInitialType } from './Form'
import { mutate as mutateCashlist } from '../Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
import numberToCurrency from '@/utils/numberToCurrency'
import toDmy from '@/utils/toDmy'

const DEFAULT_SORT_ORDER: MUISortOptions = { name: 'uuid', direction: 'desc' }
let getRowData: (dataIndex: number) => TransactionType | undefined

export default function TransactionCrud() {
    const [values, setValues] = useState<
        TransactionInitialType | TransactionType
    >(INITIAL_VALUES)

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    const [dialogTitle, setDialogTitle] = useState<string>('')

    const handleFabClick = useCallback(() => {
        setValues(INITIAL_VALUES)
        setDialogTitle('Transaksi Baru')
        setIsDialogOpen(true)
    }, [])

    const handleRowClick: OnRowClickType = useCallback((_, rowMeta, event) => {
        if (event.detail === 2) {
            const data = getRowData(rowMeta.dataIndex)

            if (data) {
                setValues(data)
            }

            setDialogTitle('Ubah Transaksi')
            setIsDialogOpen(true)
        }
    }, [])

    const handleFormSubmit: FormikConfig<
        TransactionType | TransactionInitialType
    >['onSubmit'] = useCallback(
        (values, { setErrors }) =>
            axios
                .post(`transactions/${values.uuid}`, values)
                .then(() => {
                    mutate()
                    mutateCashlist()
                    setIsDialogOpen(false)
                })
                .catch(error => errorCatcher(error, setErrors)),
        [],
    )

    return (
        <>
            <Datatable
                title="Riwayat Transaksi"
                tableId="transaction-datatable"
                apiUrl="/transactions/datatable"
                onRowClick={handleRowClick}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={DEFAULT_SORT_ORDER}
                getRowDataCallback={fn => (getRowData = fn)}
            />

            <DialogWithTitle title={dialogTitle} open={isDialogOpen}>
                <Formik
                    initialValues={values}
                    onSubmit={handleFormSubmit}
                    onReset={() => setIsDialogOpen(false)}
                    component={TransactionForm}
                />
            </DialogWithTitle>

            <Fab
                disabled={isDialogOpen}
                onClick={handleFabClick}
                aria-label="tambah transaksi">
                <PaymentsIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'uuid',
        label: 'UUID',
        options: {
            display: false,
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
        label: 'Tanggal',
        options: {
            setCellProps: getNoWrapCellProps,
            customBodyRender: toDmy,
        },
    },
    {
        name: 'cash.code',
        label: 'Kode Kas',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.cash?.code,
        },
    },
    {
        name: 'amount',
        label: 'Nilai',
        options: {
            customBodyRender: (value: number) => (
                <span
                    style={{
                        whiteSpace: 'nowrap',
                        color: value <= 0 ? 'inherit' : green[500],
                    }}>
                    {numberToCurrency(value)}
                </span>
            ),
        },
    },
    {
        name: 'desc',
        label: 'Perihal',
    },

    {
        name: 'userActivityLogs.user.name',
        label: 'Oleh',
        options: {
            customBodyRenderLite: dataIndex =>
                getRowData(dataIndex)?.user_activity_logs?.[0]?.user.name,
        },
    },
]
