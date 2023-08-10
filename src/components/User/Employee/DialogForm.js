import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import EmployeeForm from './Form'
import useFormData from '@/providers/FormData'

const UserEmployeeDialogForm = () => {
    const { isDataNotUndefined } = useFormData()

    return (
        <>
            <Dialog open={isDataNotUndefined} maxWidth="xs">
                <DialogTitle>Perbaharui Data Kepegawaian</DialogTitle>
                <DialogContent>
                    <EmployeeForm />
                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserEmployeeDialogForm
