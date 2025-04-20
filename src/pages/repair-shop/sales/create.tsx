// vendors
import { useRouter } from 'next/router'
import userHasPermission from '@/providers/Auth/userHasPermission'
// features
import Permission from '@/features/repair-shop--sale/enums/permission'
import SaleFormDialog from '@/features/repair-shop--sale/components/sale-form-dialog'
import { The401Protection } from '@/components/Layouts/auth-layout.401-protection'

export default function Page() {
    const { back } = useRouter()
    userHasPermission(Permission.CREATE)

    return (
        <>
            <The401Protection />

            <SaleFormDialog
                formData={{
                    spare_parts: [],
                    services: [],
                }}
                handleClose={() => {
                    back()
                }}
            />
        </>
    )
}
