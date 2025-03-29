// vendors
import { useRouter } from 'next/router'
// features
import Permission from '@/features/repair-shop--purchase/enums/permission'
import userHasPermission from '@/providers/Auth/userHasPermission'
import PurchaseFormDialog from '@/features/repair-shop--purchase/component/purchase-form-dialog'

export default function Page() {
    const { back } = useRouter()
    userHasPermission(Permission.CREATE)

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
