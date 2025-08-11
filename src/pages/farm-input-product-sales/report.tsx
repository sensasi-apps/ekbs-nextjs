// vendors
import { useRouter } from 'next/router'
import useSWR from 'swr'
// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
// components
import type { ProductSale } from '@/dataTypes/ProductSale'
import AuthLayout from '@/components/Layouts/AuthLayout'
import BackButton from '@/components/back-button'
import FiltersBox from '@/components/pages/farm-input-product-sales/Report/FiltersBox'
import TableHead from '@/components/pages/farm-input-product-sales/Report/Table/TableHead'
import TableBody from '@/components/pages/farm-input-product-sales/Report/Table/TableBody'
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
    } = useSWR<ProductSale[]>(
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
                data={data}
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
