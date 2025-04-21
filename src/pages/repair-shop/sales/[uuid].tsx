// vendors
import { useRouter } from 'next/router'
import useSWR from 'swr'
import userHasPermission from '@/providers/Auth/userHasPermission'
// components
import { The401Protection } from '@/components/Layouts/auth-layout.401-protection'
// features
import Permission from '@/features/repair-shop--sale/enums/permission'
import SaleFormDialog, {
    type FormData,
} from '@/features/repair-shop--sale/components/sale-form-dialog'

export default function Page() {
    const { back, query } = useRouter()
    userHasPermission(Permission.CREATE)

    const { data, isLoading } = useSWR<FormData>(
        query.uuid ? 'repair-shop/sales/' + (query.uuid as string) : null,
    )

    if (!data || isLoading) return null

    return (
        <>
            <The401Protection />

            <SaleFormDialog
                formData={data}
                handleClose={() => {
                    back()
                }}
            />
        </>
    )
}
