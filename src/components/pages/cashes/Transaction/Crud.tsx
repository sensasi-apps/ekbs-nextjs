// types
import type TransactionType from '@/dataTypes/Transaction'
import type { MUISortOptions } from 'mui-datatables'
import type { FormikConfig } from 'formik'
import type { OnRowClickType } from '@/components/Datatable'
// vendors
import { useCallback, useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import DialogWithTitle from '@/components/DialogWithTitle'
import Fab from '@/components/Fab'
// local components
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'
import TransactionForm, { INITIAL_VALUES, TransactionInitialType } from './Form'
import { mutate as mutateCashlist } from '../Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'

const DEFAULT_SORT_ORDER: MUISortOptions = { name: 'uuid', direction: 'desc' }

export default function TransactionCrud() {
    const [values, setValues] = useState<
        TransactionInitialType | TransactionType
    >(INITIAL_VALUES)

    const [dialogProps, setDialogProps] = useState({
        open: false,
        title: '',
    })

    const handleClose = useCallback(
        () => setDialogProps(prev => ({ ...prev, open: false })),
        [],
    )

    const handleFabClick = useCallback(() => {
        setValues(INITIAL_VALUES)
        setDialogProps({ title: 'Transaksi Baru', open: true })
    }, [])

    const handleRowClick: OnRowClickType = useCallback((_, rowMeta, event) => {
        if (event.detail === 2) {
            const data = getRowData<TransactionType>(rowMeta.dataIndex)

            if (data) {
                setValues(data)
            }
            setDialogProps({ title: 'Ubah Transaksi', open: true })
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
                    handleClose()
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
            />

            <DialogWithTitle title={dialogProps.title} open={dialogProps.open}>
                <Formik
                    initialValues={values}
                    onSubmit={handleFormSubmit}
                    onReset={handleClose}
                    component={TransactionForm}
                />
            </DialogWithTitle>

            <Fab
                disabled={dialogProps.open}
                onClick={handleFabClick}
                aria-label="tambah transaksi">
                <PaymentsIcon />
            </Fab>
        </>
    )
}
