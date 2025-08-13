// page components
import AuthLayout from '@/components/auth-layout'
import FarmInputProductInOutDatatable from '@/components/pages/farm-input-product-in-outs/Datatable'
import useDisablePage from '@/hooks/useDisablePage'

export default function FarmInputProductInOuts() {
    useDisablePage()

    return (
        <AuthLayout title="Barang Keluar-Masuk">
            <FarmInputProductInOutDatatable />
        </AuthLayout>
    )
}
