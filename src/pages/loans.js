import AuthLayout from '@/components/Layouts/AuthLayout'

import Fab from '@mui/material/Fab'

import PaymentsIcon from '@mui/icons-material/Payments'

import Loan from '@/classes/loan'
import useFormData, { FormDataProvider } from '@/providers/FormData'
import LoansDatatable from '@/components/Loans/Datatable'
import UserLoanDialogForm from '@/components/Loan/DialogForm'

const Component = () => {
    const { handleCreate } = useFormData()

    return (
        <AuthLayout title="Pinjaman Anda">
            <LoansDatatable apiUrl="/loans/datatable" />

            <UserLoanDialogForm mode="applier" />

            <Fab
                onClick={() => handleCreate(new Loan({}))}
                color="success"
                aria-label="Ajukan pinjaman baru"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <PaymentsIcon />
            </Fab>
        </AuthLayout>
    )
}

const UserLoans = () => (
    <FormDataProvider>
        <Component />
    </FormDataProvider>
)

export default UserLoans
