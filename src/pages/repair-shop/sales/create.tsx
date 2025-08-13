// vendors
import { useRouter } from 'next/router'
// features
// import Permission from '@/features/repair-shop--sale/enums/permission'
import SaleFormDialog from '@/features/repair-shop--sale/components/sale-form-dialog'
import { The401Protection } from '@/components/Layouts/auth-layout.401-protection'

export default function Page() {
    const { back } = useRouter()

    /**
     * TODO: will create hook that will disabled page is auth has no permission
     *
     * @see https://github.com/sensasi-apps/ekbs-nextjs/issues/372
     */
    // isAuthHasPermission(Permission.CREATE)

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
