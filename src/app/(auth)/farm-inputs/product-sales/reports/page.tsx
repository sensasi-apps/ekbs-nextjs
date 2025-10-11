'use client'

// materials
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableContainer from '@mui/material/TableContainer'
// vendors
import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import PageTitle from '@/components/page-title'
// parts
import type ProductSaleORM from '@/modules/farm-inputs/types/orms/product-sale'
import FiltersBox from './_parts/filters-box'
import TableBody from './_parts/table/table-body'
import TableFooter from './_parts/table/table-footer'
import TableHead from './_parts/table/table-head'

export default function FarmInputProductSalesReport() {
    const searchParams = useSearchParams()
    const from_date = searchParams?.get('from_date')
    const till_date = searchParams?.get('till_date')

    const {
        data = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ProductSaleORM[]>(
        from_date && till_date
            ? [
                  'farm-inputs/product-sales/report',
                  {
                      from_date: from_date,
                      till_date: till_date,
                  },
              ]
            : undefined,
    )

    return (
        <>
            <BackButton
                size="small"
                sx={{
                    mb: 2,
                }}
            />

            <PageTitle title="Laporan Penjualan SAPRODI" />

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
                            lineHeight: 'unset',
                            textTransform: 'uppercase',
                        },
                    }}>
                    <TableHead />

                    <TableBody data={data} />
                    <TableFooter data={data} />
                </Table>
            </TableContainer>
        </>
    )
}
