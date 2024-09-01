// types
import type Product from '@/dataTypes/mart/Product'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
import NumericFormat from '@/components/NumericFormat'
// enums
import Statistic from '@/enums/ApiUrl/Mart/Statistic'
// vendors
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Dialog,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import Grid2 from '@mui/material/Unstable_Grid2'
import RefreshIcon from '@mui/icons-material/Refresh'
import useSWR from 'swr'
import formatNumber from '@/utils/formatNumber'

type DataFromResponse = {
    id: Product['id']
    name: Product['name']
    qty_per_day: number
}[]

const MIN_DATE = dayjs('2024-08-01')
const DEFAULT_SPEED = 100
const MIN_ROW = 8

export default function Statistics() {
    const {
        query: { from, to, min_qty_speed },
        replace,
    } = useRouter()

    const isQueryValid = from && to

    const { data, isLoading } = useSWR<DataFromResponse>(
        isQueryValid ? [Statistic.QTY_PER_DAY, { from, to }] : null,
    )

    const [minQtySpeed, setQtyMinSpeed] = useState<number>(DEFAULT_SPEED)

    useEffect(() => {
        if (min_qty_speed) {
            setQtyMinSpeed(Number(min_qty_speed))
        }
    }, [min_qty_speed])

    const setMinQtySpeedDebounced = useDebouncedCallback((newSpeed: number) => {
        setQtyMinSpeed(newSpeed)
        replace({
            query: {
                from,
                to,
                min_qty_speed: newSpeed,
            },
        })
    }, 500)

    return (
        <AuthLayout title="Produk">
            <FiltersBox
                disabled={isLoading}
                onQtySpeedChange={newSpeed => setMinQtySpeedDebounced(newSpeed)}
            />

            <FSNCardsGrid data={data ?? []} minQtySpeed={minQtySpeed} />
        </AuthLayout>
    )
}

function DataTable({
    data,
    minRow,
}: {
    data: DataFromResponse
    minRow?: number
}) {
    const renderData = data
        .sort((a, b) => b.qty_per_day - a.qty_per_day)
        .slice(0, minRow ?? data.length)

    return (
        <>
            <TableContainer>
                <Table
                    size="small"
                    sx={{
                        '& th, & td': {
                            px: 1,
                        },
                    }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Produk</TableCell>
                            <TableCell>Penjualan/Hari</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {data.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">
                                    Tidak ada data
                                </TableCell>
                            </TableRow>
                        )}

                        {renderData.map(({ id, name, qty_per_day }) => (
                            <TableRow key={id}>
                                <TableCell>{id}</TableCell>
                                <TableCell>{name}</TableCell>
                                <TableCell>
                                    {formatNumber(qty_per_day)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {data.length > (minRow ?? data.length) && (
                <Typography variant="caption" mt={1} color="gray">
                    Dan {data.length - (minRow ?? data.length)} data lainnya
                </Typography>
            )}
        </>
    )
}

function FiltersBox({
    disabled,
    onQtySpeedChange,
}: {
    disabled: boolean
    onQtySpeedChange: (newSpeed: number) => void
}) {
    const {
        replace,
        query: { from, to, min_qty_speed },
    } = useRouter()

    const [fromDate, setFromDate] = useState<Dayjs | null>(null)
    const [toDate, setToDate] = useState<Dayjs | null>(null)

    useEffect(() => {
        if (from) {
            setFromDate(dayjs(from as string))
        }

        if (to) {
            setToDate(dayjs(to as string))
        }
    }, [from, to])

    return (
        <Box display="flex" gap={3} alignItems="center" mb={3}>
            <DatePicker
                label="TGL. Awal"
                disabled={disabled}
                value={fromDate}
                minDate={MIN_DATE}
                onChange={value => setFromDate(value)}
                disableHighlightToday
            />

            <DatePicker
                label="TGL. Akhir"
                value={toDate}
                disabled={disabled}
                minDate={fromDate ?? MIN_DATE}
                onChange={value => setToDate(value)}
                disableHighlightToday
            />

            <IconButton
                icon={RefreshIcon}
                disabled={disabled || !fromDate || !toDate}
                title="Segarkan"
                onClick={() =>
                    replace({
                        query: {
                            from: fromDate?.format('YYYY-MM-DD'),
                            to: toDate?.format('YYYY-MM-DD'),
                            min_qty_speed,
                        },
                    })
                }
            />

            <NumericFormat
                label="Kecepatan Minimum"
                disabled={disabled}
                allowNegative={false}
                value={Number(min_qty_speed) ?? DEFAULT_SPEED}
                onValueChange={({ floatValue }) =>
                    onQtySpeedChange(floatValue ?? DEFAULT_SPEED)
                }
                inputProps={{
                    sx: {
                        textAlign: 'center',
                    },
                }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">≥</InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">qty/hari</InputAdornment>
                    ),
                }}
            />
        </Box>
    )
}

function FSNCard({ title, data }: { title: string; data: DataFromResponse }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                <DataTable minRow={MIN_ROW} data={data} />
            </CardContent>

            {data.length > MIN_ROW && (
                <CardActions>
                    <SeeAllButtonAndDialog data={data} />
                </CardActions>
            )}
        </Card>
    )
}

function FSNCardsGrid({
    data,
    minQtySpeed,
}: {
    data: DataFromResponse
    minQtySpeed: number
}) {
    const fastData = data.filter(({ qty_per_day }) => qty_per_day > minQtySpeed)
    const slowData = data.filter(
        ({ qty_per_day }) => qty_per_day <= minQtySpeed && qty_per_day > 0,
    )
    const noData = data.filter(({ qty_per_day }) => qty_per_day === 0)

    return (
        <Grid2 container spacing={3}>
            <Grid2 sm={12} xs={12} md={4}>
                <FSNCard title="Pergerakan Cepat" data={fastData} />
            </Grid2>
            <Grid2 sm={12} xs={12} md={4}>
                <FSNCard title="Pergerakan Lambat" data={slowData} />
            </Grid2>
            <Grid2 sm={12} xs={12} md={4}>
                <FSNCard title="Tidak Bergerak" data={noData} />
            </Grid2>
        </Grid2>
    )
}

function SeeAllButtonAndDialog({ data }: { data: DataFromResponse }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button size="small" onClick={() => setOpen(true)}>
                Lihat Semua
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DataTable data={data} />
            </Dialog>
        </>
    )
}
