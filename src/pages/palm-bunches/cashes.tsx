// components
import AuthLayout from '@/components/auth-layout'
import UnitTxs from '@/components/UnitTxs'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

export default function Cashes() {
    return (
        <AuthLayout title="Kas Unit TBS">
            <UnitTxs businessUnit={BusinessUnit.TBS} />
        </AuthLayout>
    )
}
