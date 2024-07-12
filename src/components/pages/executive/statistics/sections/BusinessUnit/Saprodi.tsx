// vendors
import { memo, useState } from 'react'
import useSWR from 'swr'
import dayjs, { Dayjs } from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import Grid2 from '@mui/material/Unstable_Grid2'
import Skeleton from '@mui/material/Skeleton'
// icons
// components
import InOutLineChart, {
    InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import StatCard from '@/components/StatCard'
// page components
import { SX_SCROLL_MARGIN_TOP } from '@/pages/executive/statistics'
import ProductMovementTable, {
    ProductMovementTableProp,
} from '@/pages/farm-inputs/statitistics/ProductMovementTable'
import ScrollableXBox from '@/components/ScrollableXBox'
import DatePicker from '@/components/DatePicker'
import DynamicProductMovementTable, {
    DynamicProductMovementTableProp,
} from '@/pages/farm-inputs/statitistics/DynamicProductMovementTable'

const SaprodiSubsection = memo(function SaprodiSubsection() {
    const { data, isLoading } = useSWR<{
        sale_purchase_monthly_total: InOutLineChartProps['data']
        product_movements: ProductMovementTableProp['data']
    }>('executive/business-unit-section-data/farm-input')

    return (
        <Grid2 container spacing={1.5}>
            <Grid2 xs={12} id="penjualan-pembelian" sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Penjualan-Pembelian — Bulanan"
                    isLoading={isLoading}>
                    <InOutLineChart
                        data={data?.sale_purchase_monthly_total}
                        inboundAlias="Penjualan"
                        outboundAlias="Pembelian"
                    />
                </StatCard>
            </Grid2>

            <Grid2 xs={12} id="barang-keluar-masuk" sx={SX_SCROLL_MARGIN_TOP}>
                <ProductMovementTableStatCard
                    isLoading={isLoading}
                    data={data?.product_movements}
                />
            </Grid2>
        </Grid2>
    )
})

export default SaprodiSubsection

const START_OF_CURR_MONTH = dayjs().startOf('month')
const END_OF_CURR_MONTH = dayjs().endOf('month')

const ProductMovementTableStatCard = memo(
    function ProductMovementTableStatCard({
        isLoading,
        data,
    }: {
        isLoading: boolean
        data: ProductMovementTableProp['data']
    }) {
        const [selectedPeriod, setSelectedPeriod] = useState<
            '12 bulan' | 'periode tertentu'
        >('12 bulan')

        const [from, setFrom] = useState<Dayjs>(START_OF_CURR_MONTH)
        const [till, setTill] = useState<Dayjs>(END_OF_CURR_MONTH)

        const isPeriodeTertentu = selectedPeriod === 'periode tertentu'

        const { data: periodData = [], isLoading: periodDataIsLoading } =
            useSWR<DynamicProductMovementTableProp['data']>(
                isPeriodeTertentu
                    ? [
                          `farm-inputs/get-product-value-report-data`,
                          {
                              from: from.format('YYYY-MM-DD'),
                              till: till.format('YYYY-MM-DD'),
                          },
                      ]
                    : undefined,
            )

        return (
            <StatCard
                title="Barang Keluar-Masuk — Bulanan"
                isLoading={isLoading}>
                <ScrollableXBox>
                    <Chip
                        label="12 Bulan"
                        size="small"
                        color={
                            selectedPeriod === '12 bulan'
                                ? 'success'
                                : undefined
                        }
                        onClick={
                            selectedPeriod === '12 bulan'
                                ? undefined
                                : () => setSelectedPeriod('12 bulan')
                        }
                    />

                    {/* DISABLED DUE UPDATE. RESULT IS UNMATCH WITH ANOTHER */}
                    {/* <Chip
                        label="Periode Tertentu"
                        size="small"
                        color={
                            selectedPeriod === 'periode tertentu'
                                ? 'success'
                                : undefined
                        }
                        onClick={
                            selectedPeriod === 'periode tertentu'
                                ? undefined
                                : () => setSelectedPeriod('periode tertentu')
                        }
                    /> */}
                </ScrollableXBox>

                {/* DISABLED DUE UPDATE. RESULT IS UNMATCH WITH ANOTHER */}
                <Fade in={isPeriodeTertentu && false} unmountOnExit>
                    <span>
                        <ScrollableXBox mt={2}>
                            <DatePicker
                                value={from}
                                disabled={isLoading || periodDataIsLoading}
                                maxDate={till}
                                minDate={dayjs('2023-12-31')}
                                label="Awal"
                                onChange={date =>
                                    date ? setFrom(date) : undefined
                                }
                            />

                            <DatePicker
                                value={till}
                                disabled={isLoading || periodDataIsLoading}
                                minDate={from}
                                maxDate={END_OF_CURR_MONTH}
                                label="Akhir"
                                onChange={date =>
                                    date ? setTill(date) : undefined
                                }
                            />
                        </ScrollableXBox>

                        {periodDataIsLoading ? (
                            <Box mt={1}>
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                                <Skeleton />
                            </Box>
                        ) : (
                            <DynamicProductMovementTable data={periodData} />
                        )}
                    </span>
                </Fade>

                <Fade in={!isPeriodeTertentu} unmountOnExit>
                    <span>
                        <ProductMovementTable data={data} />
                    </span>
                </Fade>
            </StatCard>
        )
    },
)
