import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import AddIcon from '@mui/icons-material/Add'

import useUserWithDetails from '@/providers/UserWithDetails'
import LandsView from './View'
import UserLandFormhDialogWithUseContexts from '../Land/Form/DialogWithContexts'
import useFormData, { FormDataProvider } from '@/providers/useFormData2'

const Component = () => {
    const { data: { lands = [] } = {} } = useUserWithDetails()
    const { handleCreate } = useFormData()

    return (
        <>
            <LandsView data={lands} />

            <UserLandFormhDialogWithUseContexts />

            <Box mt={2}>
                <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleCreate}>
                    Tambah Kebun
                </Button>
            </Box>
        </>
    )
}

const UserLandsCrud = () => (
    <FormDataProvider>
        <Component />
    </FormDataProvider>
)

export default UserLandsCrud
