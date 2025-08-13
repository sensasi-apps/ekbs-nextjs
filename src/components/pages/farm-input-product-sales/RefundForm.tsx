// types
import type { MutateType } from '@/components/Datatable'
import type { ProductSale } from '@/dataTypes/ProductSale'
import type LaravelValidationException from '@/types/LaravelValidationException'
// vendors
import { useState } from 'react'
import axios from '@/lib/axios'
// materials
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
// icons
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
// utils
import handle422 from '@/utils/errorCatcher'
import FarmInput from '@/enums/permissions/FarmInput'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

export default function RefundForm({
    data,
    mutate,
}: {
    data: ProductSale
    mutate: MutateType<ProductSale>
}) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const [isRefunding, setIsRefunding] = useState(false)
    const [errors, setErrors] = useState<LaravelValidationException['errors']>(
        {},
    )

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
            <Button
                onClick={() =>
                    confirm(
                        `Apakah anda yakin ingin melakukan refund untuk penjualan dengan kode ${data.short_uuid}?`,
                    ) && handleRefund()
                }
                color="warning"
                variant="outlined"
                loading={isRefunding}
                disabled={
                    !isAuthHasPermission(FarmInput.REFUND_PRODUCT_SALE) ||
                    Boolean(data.refund_product_sale) ||
                    Boolean(data.refund_from_product_sale) ||
                    !data.is_paid
                }
                endIcon={<VolunteerActivismIcon />}>
                Refund
            </Button>

            {errors?.error && (
                <FormHelperText error>{errors.error}</FormHelperText>
            )}
        </>
    )
}
