'use client'

// vendors
import { useRouter } from 'next/navigation'
// features
import SaleFormDialog from '@/app/(auth)/repair-shop/sales/_parts/components/sale-form-dialog'

export default function Page() {
    const { back } = useRouter()

    return (
        <SaleFormDialog
            formData={{
                installment_data: {
                    n_term: 1,
                },
                is_finished: true,
                services: [],
                spare_part_margins: [],
                spare_parts: [],
            }}
            handleClose={() => {
                back()
            }}
            status={{
                isDisabled: false,
            }}
        />
    )
}
