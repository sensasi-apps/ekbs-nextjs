// vendors
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
// materials
import Alert from '@mui/material/Alert'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// icons-materials
import LockIcon from '@mui/icons-material/Lock'
// libs
import axios from '@/lib/axios'
//
import type ProductMovementOpname from '@/@types/Data/Mart/Product/MovementOpname'
import BackButton from '@/components/BackButton'
import AuthLayout from '@/components/Layouts/AuthLayout'
import AddProductFormDialog from '@/components/pages/marts/products/opnames/AddProductsFormDialog'
import DetailTable from '@/components/pages/marts/products/opnames/DetailTable'
import SummaryTable from '@/components/pages/marts/products/opnames/SummaryTable'
import PrintHandler from '@/components/PrintHandler'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'

export default function OpnameDetail() {
    const {
        reload,
        query: { uuid },
    } = useRouter()

    const { data, isLoading, isValidating } = useSWR<ProductMovementOpname>(
        uuid
            ? OpnameApiUrl.UPDATE_OR_GET_DETAIL.replace('$', uuid as string)
            : undefined,
    )

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [detailQtys, setDetailQtys] = useState<
        {
            id: number
            qty: number
        }[]
    >([])

    useEffect(() => {
        if (data) {
            setDetailQtys(
                data.details.map(detail => ({
                    id: detail.id,
                    qty: detail.qty,
                })),
            )
        }
    }, [data])

    const isQtyChanged = detailQtys.some(
        detail =>
            data?.details.find(({ id }) => id === detail.id)?.qty !==
            detail.qty,
    )

    const mainIsLoading = isLoading || isValidating || isSubmitting

    if (uuid === undefined) return null

    return (
        <AuthLayout title="Detail Opname">
            <Fade in={!data?.finished_at} unmountOnExit>
                <Alert
                    severity="warning"
                    variant="outlined"
                    sx={{
                        mb: 2,
                    }}>
                    Pastikan untuk tidak melakukan transaksi pada produk yang
                    sedang diopname hingga proses opname selesai.
                </Alert>
            </Fade>

            <BackButton />

            <Box display="flex" gap={2}>
                <Typography variant="h6" component="p">
                    Rangkuman
                </Typography>

                {!data?.finished_at && (
                    <Button
                        startIcon={<LockIcon />}
                        variant="outlined"
                        disabled={mainIsLoading || isQtyChanged}
                        color="warning"
                        size="small"
                        onClick={() => {
                            setIsSubmitting(true)

                            axios
                                .put(
                                    OpnameApiUrl.FINISH.replace(
                                        '$',
                                        uuid as string,
                                    ),
                                )
                                .then(() => reload())
                        }}>
                        Simpan Permanen
                    </Button>
                )}
            </Box>

            {data && <SummaryTable data={data} />}

            <Box display="flex" alignItems="center" mt={3} mb={1}>
                <Typography variant="h6" component="p">
                    Rincian
                </Typography>

                {!data?.finished_at && (
                    <AddProductFormDialog
                        disabled={mainIsLoading}
                        productMovementUuid={uuid as string}
                    />
                )}

                <Box ml={4}>
                    <PrintHandler
                        slotProps={{
                            printButton: {
                                disabled: mainIsLoading,
                            },
                        }}>
                        <Typography gutterBottom fontWeight="bold">
                            Opname Stok Belayan Mart{' '}
                            {data?.finished_at ? '' : '— DRAF'}
                        </Typography>

                        <Typography variant="body2" fontWeight="bold">
                            Rangkuman
                        </Typography>

                        {data && <SummaryTable data={data} />}

                        <Typography variant="body2" mt={2} fontWeight="bold">
                            Rincian
                        </Typography>
                        <DetailTable
                            data={data?.details ?? []}
                            finished={Boolean(data?.finished_at)}
                        />
                    </PrintHandler>
                </Box>

                {!data?.finished_at && (
                    <Button
                        variant="contained"
                        sx={{
                            ml: 4,
                        }}
                        size="small"
                        disabled={mainIsLoading || !isQtyChanged}
                        onClick={() => {
                            setIsSubmitting(true)

                            axios
                                .put(OpnameApiUrl.UPDATE_DETAIL_QTYS, {
                                    pmd_id_and_qtys: detailQtys,
                                })
                                .then(() => reload())
                        }}>
                        Simpan Perubahan
                    </Button>
                )}
            </Box>

            <Fade in={mainIsLoading} unmountOnExit>
                <LinearProgress />
            </Fade>

            <DetailTable
                disabled={isSubmitting}
                finished={Boolean(data?.finished_at)}
                data={data?.details ?? []}
                onValueChange={(id, value) =>
                    setDetailQtys(prev => {
                        const index = prev.findIndex(detail => detail.id === id)
                        const warehouseState = data?.details.find(
                            detail => detail.id === id,
                        )?.warehouse_state

                        prev[index].qty = value - (warehouseState?.qty ?? 0)
                        return [...prev]
                    })
                }
            />
        </AuthLayout>
    )
}
