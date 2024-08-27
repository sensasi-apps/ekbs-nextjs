// vendors
import { Fade, LinearProgress, Table, TableContainer } from '@mui/material'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import BackButton from '@/components/BackButton'
import FiltersBox from '@/components/pages/farm-input-product-sales/Report/FiltersBox'
import TableHead from '@/components/pages/farm-input-product-sales/Report/Table/TableHead'
import TableBody from '@/components/pages/farm-input-product-sales/Report/Table/TableBody'
import useSWR from 'swr'
import ProductSaleType from '@/dataTypes/ProductSale'
import { useRouter } from 'next/router'
import TableFooter from '@/components/pages/farm-input-product-sales/Report/Table/TableFooter'

export default function FarmInputProductSalesReport() {
    const {
        query: { from_date, till_date },
    } = useRouter()

    const {
        data = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ProductSaleType[]>(
        from_date && till_date
            ? [
                  apiUrl,
                  {
                      from_date: from_date,
                      till_date: till_date,
                  },
              ]
            : undefined,
    )

    return (
        <AuthLayout title="Laporan Penjualan SAPRODI">
            <BackButton
                size="small"
                sx={{
                    mb: 2,
                }}
            />

            <FiltersBox
                disabled={isLoading || isValidating}
                onRefresh={() => {
                    mutate()
                }}
            />

            <Fade in={isLoading || isValidating}>
                <LinearProgress
                    sx={{
                        mt: 4,
                    }}
                />
            </Fade>

            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        '& td': {
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            lineHeight: 'unset',
                        },
                    }}>
                    <TableHead />

                    <TableBody data={data} />
                    <TableFooter data={data} />
                </Table>
            </TableContainer>
        </AuthLayout>
    )
}

export const apiUrl = 'farm-inputs/product-sales/report'
