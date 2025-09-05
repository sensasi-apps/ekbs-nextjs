import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import AddIcon from '@mui/icons-material/Add'

import useUserWithDetails from '@/app/(auth)/systems/users/[[...uuid]]/_parts/user-with-details-provider'
import LandsView from '@/modules/user/components/land-list'
import UserLandFormDialogWithUseContexts from '@/modules/user/components/user-land-form/dialog-with-contexts'
import useFormData, { FormDataProvider } from '@/providers/useFormData'

function InnerComponent() {
    const { data: { lands = [] } = {} } = useUserWithDetails()
    const { handleCreate } = useFormData()

    return (
        <>
            <LandsView data={lands} />

            <UserLandFormDialogWithUseContexts />

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

export default function UserLandCrud() {
    return (
        <FormDataProvider>
            <InnerComponent />
        </FormDataProvider>
    )
}
