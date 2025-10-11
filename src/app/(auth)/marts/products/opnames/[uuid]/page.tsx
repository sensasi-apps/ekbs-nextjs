'use client'

// icons-materials
import LockIcon from '@mui/icons-material/Lock'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
// vendors
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import AddProductFormDialog from '@/app/(auth)/marts/products/opnames/_parts/add-products-form-dialog'
import DetailTable from '@/app/(auth)/marts/products/opnames/_parts/detail-table'
import SummaryTable from '@/app/(auth)/marts/products/opnames/_parts/summary-table'
//
import BackButton from '@/components/back-button'
import PrintHandler from '@/components/PrintHandler'
// libs
import axios from '@/lib/axios'
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
// parts
import type ProductMovementOpname from '@/modules/mart/types/orms/product-movement-opname'

export default function OpnameDetail() {
    const { refresh } = useRouter()
    const params = useParams()
    const uuid = params?.uuid

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
        <>
            <Fade in={!data?.finished_at} unmountOnExit>
                <Alert
                    severity="warning"
                    sx={{
                        mb: 2,
                    }}
                    variant="outlined">
                    Pastikan untuk tidak melakukan transaksi pada produk yang
                    sedang di-opname hingga proses opname selesai.
                </Alert>
            </Fade>

            <BackButton />

            <Box display="flex" gap={2} mt={2}>
                <Typography component="p" variant="h6">
                    Rangkuman
                </Typography>

                {!data?.finished_at && (
                    <Button
                        color="warning"
                        disabled={mainIsLoading || isQtyChanged}
                        onClick={() => {
                            setIsSubmitting(true)

                            axios
                                .put(
                                    OpnameApiUrl.FINISH.replace(
                                        '$',
                                        uuid as string,
                                    ),
                                )
                                .then(() => refresh())
                        }}
                        size="small"
                        startIcon={<LockIcon />}
                        variant="outlined">
                        Simpan Permanen
                    </Button>
                )}
            </Box>

            {data && <SummaryTable data={data} />}

            <Box alignItems="center" display="flex" mb={1} mt={3}>
                <Typography component="p" variant="h6">
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
                        <Typography fontWeight="bold" gutterBottom>
                            Opname Stok Belayan Mart{' '}
                            {data?.finished_at ? '' : '— DRAF'}
                        </Typography>

                        <Typography fontWeight="bold" variant="body2">
                            Rangkuman
                        </Typography>

                        {data && <SummaryTable data={data} />}

                        <Typography fontWeight="bold" mt={2} variant="body2">
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
                        disabled={mainIsLoading || !isQtyChanged}
                        onClick={() => {
                            setIsSubmitting(true)

                            axios
                                .put(OpnameApiUrl.UPDATE_DETAIL_QTYS, {
                                    pmd_id_and_qtys: detailQtys,
                                })
                                .then(() => refresh())
                        }}
                        size="small"
                        sx={{
                            ml: 4,
                        }}
                        variant="contained">
                        Simpan Perubahan
                    </Button>
                )}
            </Box>

            <Fade in={mainIsLoading} unmountOnExit>
                <LinearProgress />
            </Fade>

            <DetailTable
                data={data?.details ?? []}
                disabled={isSubmitting}
                finished={Boolean(data?.finished_at)}
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
        </>
    )
}
