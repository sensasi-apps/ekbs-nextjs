// types

// icons
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
// materials
import Button from '@mui/material/Button'
import FormHelperText from '@mui/material/FormHelperText'
// vendors
import { useState } from 'react'
import type { MutateType } from '@/components/data-table'
import FarmInput from '@/enums/permissions/FarmInput'
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import axios from '@/lib/axios'
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import type LaravelValidationException from '@/types/laravel-validation-exception-response'
// utils
import handle422 from '@/utils/handle-422'

export default function RefundForm({
    data,
    mutate,
}: {
    data: ProductSaleORM
    mutate: MutateType<ProductSaleORM>
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
                color="warning"
                disabled={
                    !isAuthHasPermission(FarmInput.REFUND_PRODUCT_SALE) ||
                    Boolean(data.refund_product_sale) ||
                    Boolean(data.refund_from_product_sale) ||
                    !data.is_paid
                }
                endIcon={<VolunteerActivismIcon />}
                loading={isRefunding}
                onClick={() =>
                    confirm(
                        `Apakah anda yakin ingin melakukan refund untuk penjualan dengan kode ${data.short_uuid}?`,
                    ) && handleRefund()
                }
                variant="outlined">
                Refund
            </Button>

            {errors?.error && (
                <FormHelperText error>{errors.error}</FormHelperText>
            )}
        </>
    )
}
