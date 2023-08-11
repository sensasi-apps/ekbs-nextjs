import { FormDataProvider } from '@/providers/FormData'
import TransactionsDatatable from './Datatable'
import TransactionDialogForm from '../Transaction/DialogForm'
import TransactionFab from '../Transaction/Fab'

export default function TransactionsCrud() {
    return (
        <FormDataProvider>
            <TransactionsDatatable />
            <TransactionDialogForm />
            <TransactionFab />
        </FormDataProvider>
    )
}
