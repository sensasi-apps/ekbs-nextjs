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
                spare_parts: [],
                services: [],
            }}
            handleClose={() => {
                back()
            }}
        />
    )
}
