import EmployeeBox from './Box'
import UserEmployeeDialogForm from './DialogForm'

import { FormDataProvider } from '@/providers/FormData'

const UserEmployeeCrud = () => {
    return (
        <FormDataProvider>
            <EmployeeBox />
            <UserEmployeeDialogForm />
        </FormDataProvider>
    )
}

export default UserEmployeeCrud
