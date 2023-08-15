import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import LoanForm from '@/components/Loan/Form'
import useFormData from '@/providers/FormData'
import Loan from '@/classes/loan'

const UserLoanDialogForm = ({ mode }) => {
    const {
        data = new Loan({}),
        isDataNotUndefined,
        isNew,
        handleClose,
    } = useFormData()

    const title = isNew
        ? 'Ajukan Pinjaman Baru'
        : data.hasResponses
        ? 'Rincian Pinjaman'
        : 'Perbarui Pinjaman'

    return (
        <Dialog open={isDataNotUndefined} fullWidth maxWidth="xs">
            <DialogTitle display="flex" justifyContent="space-between">
                {title}
                <IconButton size="small" onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <LoanForm mode={mode} handleClose={handleClose} />
            </DialogContent>
        </Dialog>
    )
}

export default UserLoanDialogForm
