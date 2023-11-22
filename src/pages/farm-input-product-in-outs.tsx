// page components
import AuthLayout from '@/components/Layouts/AuthLayout'
import FarmInputProductInOutDatatable from '@/components/pages/farm-input-product-in-outs/Datatable'

export default function FarmInputProductInOuts() {
    return (
        <AuthLayout title="Barang Keluar-Masuk">
            <FarmInputProductInOutDatatable />
        </AuthLayout>
    )
}
