import type InstallmentORM from '@/modules/installment/types/orms/installment'
import Typography from '@mui/material/Typography'

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
    }

    return (
        <>
            {theReturn}
            <Typography variant="caption" fontSize="0.7rem" component="div">
                {installmentable_uuid?.slice(-6).toUpperCase()}
            </Typography>
        </>
    )
}
