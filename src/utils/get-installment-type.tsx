import Typography from '@mui/material/Typography'
import type InstallmentORM from '@/modules/installment/types/orms/installment'

export default function getInstallmentType({
    installmentable_classname,
    installmentable_uuid,
}: InstallmentORM) {
    let theReturn: string = ''

    switch (installmentable_classname) {
        case 'App\\Models\\ProductSale':
            theReturn = 'Penjualan Produk (SAPRODI)'
            break

        case 'App\\Models\\UserLoan':
            theReturn = 'Pinjaman (SPP)'
            break

        case 'App\\Models\\RentItemRent':
            theReturn = 'Sewa Alat Berat'
            break

        case 'Modules\\RepairShop\\Models\\Sale':
            theReturn = 'Belayan Spare Parts'
            break
    }

    return (
        <>
            {theReturn}
            <Typography component="div" fontSize="0.7rem" variant="caption">
                {installmentable_uuid?.slice(-6).toUpperCase()}
            </Typography>
        </>
    )
}
