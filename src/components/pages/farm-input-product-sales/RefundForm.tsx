// types
import type { MutateType } from '@/components/Datatable'
import type ProductSaleType from '@/dataTypes/ProductSale'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import FormHelperText from '@mui/material/FormHelperText'
import LoadingButton from '@mui/lab/LoadingButton'
// icons
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
// utils
import handle422 from '@/utils/errorCatcher'
import useAuth from '@/providers/Auth'
import FarmInput from '@/enums/permissions/FarmInput'

export default function RefundForm({
    data,
    mutate,
}: {
    data: ProductSaleType
    mutate: MutateType<ProductSaleType>
}) {
    const { userHasPermission } = useAuth()
    const [isRefunding, setIsRefunding] = useState(false)
    const [errors, setErrors] = useState<any>({})

    const handleRefund = () => {
        setIsRefunding(true)

        axios
            .post(`farm-inputs/product-sales/${data.uuid}/refund`)
            .catch(error => handle422(error, setErrors))
            .finally(() => {
                mutate()
            })
    }
    return (
        <>
            <LoadingButton
                onClick={() =>
                    confirm(
                        `Apakah anda yakin ingin melakukan refund untuk penjualan dengan kode ${data.short_uuid}?`,
                    ) && handleRefund()
                }
                color="warning"
                variant="outlined"
                loading={isRefunding}
                disabled={
                    !userHasPermission(FarmInput.REFUND_PRODUCT_SALE) ||
                    Boolean(data.refund_product_sale) ||
                    Boolean(data.refund_from_product_sale) ||
                    !Boolean(data.is_paid)
                }
                endIcon={<VolunteerActivismIcon />}>
                Refund
            </LoadingButton>

            {errors?.error && (
                <FormHelperText error>{errors.error}</FormHelperText>
            )}
        </>
    )
}
