import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import useFormData from '@/providers/FormData'
import TransactionForm from './Form'

const TransactionDialogForm = () => {
    const { data, isDataNotUndefined, handleClose, isNew } = useFormData()
    return (
        <Dialog open={isDataNotUndefined} fullWidth maxWidth="xs">
            <DialogTitle>
                {isNew ? 'Tambah Transaksi baru' : 'Ubah Data Transaksi'}
            </DialogTitle>
            <DialogContent>
                <TransactionForm data={data} handleClose={handleClose} />
            </DialogContent>
        </Dialog>
    )
}

export default TransactionDialogForm
