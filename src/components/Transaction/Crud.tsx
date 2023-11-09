// types
import type TransactionType from '@/dataTypes/Transaction'
import type { OnRowClickType } from '@/components/Global/Datatable'
import type { MUISortOptions } from 'mui-datatables'
// vendors
import { useCallback, useState } from 'react'
import { Formik } from 'formik'
import axios from '@/lib/axios'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// icons
import PaymentsIcon from '@mui/icons-material/Payments'
// components
import Datatable, {
    getDataRow,
    mutate as mutateDatatable,
} from '@/components/Global/Datatable'
import Fab from '@/components/Global/Fab'
import { mutate as mutateCashlist } from '@/components/Cash/List'
// utils
import errorCatcher from '@/utils/errorCatcher'
// local components
import DATATABLE_COLUMNS from './DATATABLE_COLUMNS'
import TransactionForm, { INITIAL_VALUES, TransactionInitialType } from './Form'

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
            setValues(getDataRow<TransactionType>(rowMeta.dataIndex))
            setDialogProps({ title: 'Ubah Transaksi', open: true })
        }
    }, [])

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

            <Dialog open={dialogProps.open} fullWidth maxWidth="xs">
                <DialogTitle>{dialogProps.title}</DialogTitle>
                <DialogContent>
                    <Formik
                        enableReinitialize
                        initialValues={values}
                        onSubmit={(values, { setErrors }) =>
                            axios
                                .post(`transactions/${values.uuid}`, values)
                                .then(() => {
                                    mutateDatatable()
                                    mutateCashlist()
                                    handleClose()
                                })
                                .catch(error => errorCatcher(error, setErrors))
                        }
                        onReset={() => handleClose()}>
                        {props => <TransactionForm {...props} />}
                    </Formik>
                </DialogContent>
            </Dialog>

            <Fab
                disabled={dialogProps.open}
                onClick={handleFabClick}
                aria-label="tambah transaksi">
                <PaymentsIcon />
            </Fab>
        </>
    )
}
