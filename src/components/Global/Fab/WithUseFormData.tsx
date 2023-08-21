import { FC, PropsWithChildren } from 'react'
import Fab from '@mui/material/Fab'
import useFormData from '@/providers/useFormData'

const SX = {
    position: 'fixed',
    bottom: 16,
    right: 16,
}

const FabWithUseFormData: FC<PropsWithChildren> = ({ children }) => {
    const { handleCreate, formOpen } = useFormData()

    return (
        <Fab disabled={formOpen} onClick={handleCreate} color="success" sx={SX}>
            {children}
        </Fab>
    )
}

export default FabWithUseFormData
