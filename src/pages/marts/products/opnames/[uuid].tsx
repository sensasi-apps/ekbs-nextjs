import ProductMovementOpname from '@/@types/Data/Mart/Product/MovementOpname'
import AuthLayout from '@/components/Layouts/AuthLayout'
import AddProductFormDialog from '@/components/pages/marts/products/opnames/AddProductsFormDialog'
import DetailTable from '@/components/pages/marts/products/opnames/DetailTable'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
import { Alert, Box, Fade, LinearProgress, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import useSWR from 'swr'

export default function OpnameDetail() {
    const {
        query: { uuid },
    } = useRouter()

    const { data, isLoading } = useSWR<ProductMovementOpname>(
        uuid ? OpnameApiUrl.GET_DETAIL.replace('$', uuid as string) : undefined,
    )

    if (uuid === undefined) return null

    return (
        <AuthLayout title="Detail Opname">
            <Alert severity="warning">
                Pastikan untuk tidak melakukan transaksi pada produk yang sedang
                diopname hingga proses opname selesai.
            </Alert>

            <Box display="flex" alignItems="center">
                <Typography>Rincian</Typography>

                <AddProductFormDialog productMovementUuid={uuid as string} />
            </Box>

            <Fade in={isLoading} unmountOnExit>
                <LinearProgress />
            </Fade>
            <DetailTable data={data?.details ?? []} />
        </AuthLayout>
    )
}
