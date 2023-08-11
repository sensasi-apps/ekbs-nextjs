import Fab from '@mui/material/Fab'
import PaymentsIcon from '@mui/icons-material/Payments'

import useFormData from '@/providers/FormData'

const TransactionFab = () => {
    const { isDataNotUndefined, handleCreate } = useFormData()

    return (
        <Fab
            disabled={isDataNotUndefined}
            onClick={handleCreate}
            color="success"
            aria-label="tambah transaksi"
            sx={{
                position: 'fixed',
                bottom: 16,
                right: 16,
            }}>
            <PaymentsIcon />
        </Fab>
    )
}

export default TransactionFab
