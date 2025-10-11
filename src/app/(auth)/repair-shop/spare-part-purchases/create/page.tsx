'use client'

// vendors
import { useRouter } from 'next/navigation'
// features
import PurchaseFormDialog from '@/app/(auth)/repair-shop/spare-part-purchases/_parts/component/purchase-form-dialog'
//
// import Permission from '@/features/repair-shop--purchase/enums/permission'
// import userHasPermission from '@/providers/Auth/userHasPermission'

export default function Page() {
    const { back } = useRouter()

    return (
        <PurchaseFormDialog
            formData={{
                costs: [],
                details: [],
            }}
            handleClose={() => {
                back()
            }}
        />
    )
}
