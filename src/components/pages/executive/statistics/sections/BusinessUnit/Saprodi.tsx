// vendors
import { memo, useState } from 'react'
import useSWR from 'swr'
import dayjs, { Dayjs } from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// components
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import StatCard from '@/components/StatCard'
// page components
import ProductMovementTable, {
    type ProductMovementTableProp,
} from './saprodi/ProductMovementTable'
import ScrollableXBox from '@/components/ScrollableXBox'
import DatePicker from '@/components/DatePicker'
import DynamicProductMovementTable, {
    type DynamicProductMovementTableProp,
} from './saprodi/DynamicProductMovementTable'
import IconButton from '@/components/IconButton'
// constants
import SX_SCROLL_MARGIN_TOP from '../../SX_SCROLL_MARGIN_TOP'

const SaprodiSubsection = memo(function SaprodiSubsection() {
    const { data, isLoading } = useSWR<{
        sale_purchase_monthly_total: InOutLineChartProps['data']
        product_movements: ProductMovementTableProp['data']
    }>('executive/business-unit-section-data/farm-input')

    return (
        <Grid container spacing={1.5}>
            <Grid
                size={{ xs: 12 }}
                id="penjualan-pembelian"
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    title="Penjualan-Pembelian — Bulanan"
                    isLoading={isLoading}>
                    <InOutLineChart
                        data={data?.sale_purchase_monthly_total}
                        inboundAlias="Penjualan"
                        outboundAlias="Pembelian"
                    />
                </StatCard>
            </Grid>

            <Grid
                size={{ xs: 12 }}
                id="barang-keluar-masuk"
                sx={SX_SCROLL_MARGIN_TOP}>
                <ProductMovementTableStatCard
                    isLoading={isLoading}
                    data={data?.product_movements}
                />
            </Grid>
        </Grid>
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

        const [swrParams, setSwrParams] = useState<{
            from: string
            till: string
        }>({
            from: START_OF_CURR_MONTH.format('YYYY-MM-DD'),
            till: END_OF_CURR_MONTH.format('YYYY-MM-DD'),
        })

        const isPeriodeTertentu = selectedPeriod === 'periode tertentu'

        const {
            data: periodData = [],
            isLoading: periodDataIsLoading,
            isValidating,
            mutate,
        } = useSWR<DynamicProductMovementTableProp['data']>(
            isPeriodeTertentu && swrParams
                ? [`farm-inputs/get-product-value-report-data`, swrParams]
                : undefined,
            null,
            {},
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

                    <Chip
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
                    />
                </ScrollableXBox>

                <Fade in={isPeriodeTertentu} unmountOnExit>
                    <span>
                        <ScrollableXBox mt={2}>
                            <DatePicker
                                value={from}
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                maxDate={till}
                                minDate={dayjs('2023-12-31')}
                                label="Awal"
                                onChange={date =>
                                    date ? setFrom(date) : undefined
                                }
                            />

                            <DatePicker
                                value={till}
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                minDate={from}
                                maxDate={END_OF_CURR_MONTH}
                                label="Akhir"
                                onChange={date =>
                                    date ? setTill(date) : undefined
                                }
                            />

                            <IconButton
                                title="Segarkan"
                                icon={RefreshIcon}
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                onClick={() =>
                                    setSwrParams(prev => {
                                        const newParams = {
                                            from: from.format('YYYY-MM-DD'),
                                            till: till.format('YYYY-MM-DD'),
                                        }

                                        if (
                                            JSON.stringify(prev) ===
                                            JSON.stringify(newParams)
                                        ) {
                                            mutate()
                                            return prev
                                        }

                                        return newParams
                                    })
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
