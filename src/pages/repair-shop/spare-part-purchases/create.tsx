// vendors
import { useRouter } from 'next/router'
// features
import PurchaseFormDialog from '@/features/repair-shop--purchase/component/purchase-form-dialog'
//
// import Permission from '@/features/repair-shop--purchase/enums/permission'
// import userHasPermission from '@/providers/Auth/userHasPermission'

export default function Page() {
    const { back } = useRouter()

    return (
        <PurchaseFormDialog
            formData={{
                details: [],
                costs: [],
            }}
            handleClose={() => {
                back()
            }}
        />
    )
}
