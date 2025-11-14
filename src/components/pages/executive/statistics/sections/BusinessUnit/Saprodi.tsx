// vendors

// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import dayjs, { Dayjs } from 'dayjs'
import { memo, useState } from 'react'
import useSWR from 'swr'
// components
import InOutLineChart, {
    type InOutLineChartProps,
} from '@/components/Chart/Line/InOut'
import DatePicker from '@/components/date-picker'
import IconButton from '@/components/icon-button'
import ScrollableXBox from '@/components/ScrollableXBox'
import StatCard from '@/components/StatCard'
// constants
import SX_SCROLL_MARGIN_TOP from '../../SX_SCROLL_MARGIN_TOP'
import DynamicProductMovementTable, {
    type DynamicProductMovementTableProp,
} from './saprodi/DynamicProductMovementTable'
// page components
import ProductMovementTable, {
    type ProductMovementTableProp,
} from './saprodi/ProductMovementTable'

const SaprodiSubsection = memo(function SaprodiSubsection() {
    const { data, isLoading } = useSWR<{
        sale_purchase_monthly_total: InOutLineChartProps['data']
        product_movements: ProductMovementTableProp['data']
    }>('executive/business-unit-section-data/farm-input')

    return (
        <Grid container spacing={1.5}>
            <Grid
                id="penjualan-pembelian"
                size={{ xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <StatCard
                    isLoading={isLoading}
                    title="Penjualan-Pembelian — Bulanan">
                    <InOutLineChart
                        data={data?.sale_purchase_monthly_total}
                        inboundAlias="Penjualan"
                        outboundAlias="Pembelian"
                    />
                </StatCard>
            </Grid>

            <Grid
                id="barang-keluar-masuk"
                size={{ xs: 12 }}
                sx={SX_SCROLL_MARGIN_TOP}>
                <ProductMovementTableStatCard
                    data={data?.product_movements}
                    isLoading={isLoading}
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
                isLoading={isLoading}
                title="Barang Keluar-Masuk — Bulanan">
                <ScrollableXBox>
                    <Chip
                        color={
                            selectedPeriod === '12 bulan'
                                ? 'success'
                                : undefined
                        }
                        label="12 Bulan"
                        onClick={
                            selectedPeriod === '12 bulan'
                                ? undefined
                                : () => setSelectedPeriod('12 bulan')
                        }
                        size="small"
                    />

                    <Chip
                        color={
                            selectedPeriod === 'periode tertentu'
                                ? 'success'
                                : undefined
                        }
                        label="Periode Tertentu"
                        onClick={
                            selectedPeriod === 'periode tertentu'
                                ? undefined
                                : () => setSelectedPeriod('periode tertentu')
                        }
                        size="small"
                    />
                </ScrollableXBox>

                <Fade in={isPeriodeTertentu} unmountOnExit>
                    <span>
                        <ScrollableXBox mt={2}>
                            <DatePicker
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                label="Awal"
                                maxDate={till}
                                minDate={dayjs('2023-12-31')}
                                onChange={date =>
                                    date ? setFrom(date) : undefined
                                }
                                value={from}
                            />

                            <DatePicker
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                label="Akhir"
                                maxDate={END_OF_CURR_MONTH}
                                minDate={from}
                                onChange={date =>
                                    date ? setTill(date) : undefined
                                }
                                value={till}
                            />

                            <IconButton
                                disabled={
                                    isLoading ||
                                    periodDataIsLoading ||
                                    isValidating
                                }
                                icon={RefreshIcon}
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
                                title="Segarkan"
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
