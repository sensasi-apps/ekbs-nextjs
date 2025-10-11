import AddIcon from '@mui/icons-material/Add'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import LandsView from '@/modules/user/components/land-list'
import UserLandFormDialogWithUseContexts from '@/modules/user/components/user-land-form/dialog-with-contexts'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import useUserDetailSwr from '../hooks/use-user-detail-swr'

function InnerComponent() {
    const { data: { lands = [] } = {} } = useUserDetailSwr()
    const { handleCreate } = useFormData()

    return (
        <>
            <LandsView data={lands} />

            <UserLandFormDialogWithUseContexts />

            <Box mt={2}>
                <Button
                    color="info"
                    onClick={handleCreate}
                    size="small"
                    startIcon={<AddIcon />}
                    variant="outlined">
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
