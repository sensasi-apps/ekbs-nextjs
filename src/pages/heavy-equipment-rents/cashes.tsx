// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import UnitTxs from '@/components/UnitTxs'
// enums
import BusinessUnit from '@/enums/BusinessUnit'

export default function Cashes() {
    return (
        <AuthLayout title="">
            <UnitTxs businessUnit={BusinessUnit.ALAT_BERAT} />
        </AuthLayout>
    )
}
