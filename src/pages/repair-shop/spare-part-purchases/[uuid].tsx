// vendors
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
// materials
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
// libs
import myAxios from '@/lib/axios'
// features
import type SparePart from '@/features/repair-shop--spare-part/types/spare-part'
import PurchaseFormDialog from '@/features/repair-shop--purchase/component/purchase-form-dialog'
import Endpoint from '@/features/repair-shop--purchase/enums/endpoint'

export default function Page() {
    const { back, query } = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [data, setData] = useState<SparePart>()

    useEffect(() => {
        if (query.uuid) {
            myAxios
                .get<SparePart>(
                    Endpoint.READ.replace('$1', (query.uuid as string) ?? ''),
                )
                .then(res => {
                    setData(res.data)
                    setIsLoading(false)
                })
        }
    }, [query])

    if (isLoading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                width="100vw"
                height="100vh">
                <CircularProgress color="success" />
            </Box>
        )
    }

    return (
        <PurchaseFormDialog
            formData={data}
            handleClose={() => {
                back()
            }}
        />
    )
}
