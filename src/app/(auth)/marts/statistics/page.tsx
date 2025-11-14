'use client'

// icons-materials
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Dialog from '@mui/material/Dialog'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs, { type Dayjs } from 'dayjs'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useDebouncedCallback } from 'use-debounce'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/icon-button'
import NumericFormat from '@/components/NumericFormat'
import PageTitle from '@/components/page-title'
// enums
import Statistic from '@/modules/mart/enums/statistic-api-url'
//
import type Product from '@/modules/mart/types/orms/product'
// utils
import formatNumber from '@/utils/format-number'

type DataFromResponse = {
    id: Product['id']
    name: Product['name']
    qty_per_day: number
}[]

const MIN_DATE = dayjs('2024-08-01')
const DEFAULT_SPEED = 100
const MIN_ROW = 8

export default function Statistics() {
    const { replace } = useRouter()

    const searchParams = useSearchParams()

    const from = searchParams?.get('from')
    const to = searchParams?.get('to')
    const min_qty_speed = searchParams?.get('min_qty_speed')

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

        replace(`?from=${from}&to=${to}&min_qty_speed=${newSpeed}`)
    }, 500)

    return (
        <>
            <PageTitle title="Produk" />
            <FiltersBox
                disabled={isLoading}
                onQtySpeedChange={newSpeed => setMinQtySpeedDebounced(newSpeed)}
            />

            <FSNCardsGrid data={data ?? []} minQtySpeed={minQtySpeed} />
        </>
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
                                <TableCell align="center" colSpan={3}>
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
                <Typography color="gray" mt={1} variant="caption">
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
    const { replace } = useRouter()
    const searchParams = useSearchParams()

    const from = searchParams?.get('from')
    const to = searchParams?.get('to')
    const min_qty_speed = searchParams?.get('min_qty_speed')

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
        <Box alignItems="center" display="flex" gap={3} mb={3}>
            <DatePicker
                disabled={disabled}
                disableHighlightToday
                label="TGL. Awal"
                minDate={MIN_DATE}
                onChange={value => setFromDate(value)}
                value={fromDate}
            />

            <DatePicker
                disabled={disabled}
                disableHighlightToday
                label="TGL. Akhir"
                minDate={fromDate ?? MIN_DATE}
                onChange={value => setToDate(value)}
                value={toDate}
            />

            <IconButton
                disabled={disabled || !fromDate || !toDate}
                icon={RefreshIcon}
                onClick={() =>
                    replace(
                        `?from=${fromDate?.format('YYYY-MM-DD')}&to=${toDate?.format('YYYY-MM-DD')}&min_qty_speed=${min_qty_speed}`,
                    )
                }
                title="Segarkan"
            />

            <NumericFormat
                allowNegative={false}
                disabled={disabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">qty/hari</InputAdornment>
                    ),
                    startAdornment: (
                        <InputAdornment position="start">≥</InputAdornment>
                    ),
                }}
                inputProps={{
                    sx: {
                        textAlign: 'center',
                    },
                }}
                label="Kecepatan Minimum"
                onValueChange={({ floatValue }) =>
                    onQtySpeedChange(floatValue ?? DEFAULT_SPEED)
                }
                value={Number(min_qty_speed ?? DEFAULT_SPEED)}
            />
        </Box>
    )
}

function FSNCard({ title, data }: { title: string; data: DataFromResponse }) {
    return (
        <Card>
            <CardContent>
                <Typography gutterBottom variant="h6">
                    {title}
                </Typography>

                <DataTable data={data} minRow={MIN_ROW} />
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
        <Grid container spacing={3}>
            <Grid
                size={{
                    md: 4,
                    sm: 12,
                    xs: 12,
                }}>
                <FSNCard data={fastData} title="Pergerakan Cepat" />
            </Grid>
            <Grid
                size={{
                    md: 4,
                    sm: 12,
                    xs: 12,
                }}>
                <FSNCard data={slowData} title="Pergerakan Lambat" />
            </Grid>
            <Grid
                size={{
                    md: 4,
                    sm: 12,
                    xs: 12,
                }}>
                <FSNCard data={noData} title="Tidak Bergerak" />
            </Grid>
        </Grid>
    )
}

function SeeAllButtonAndDialog({ data }: { data: DataFromResponse }) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button onClick={() => setOpen(true)} size="small">
                Lihat Semua
            </Button>

            <Dialog onClose={() => setOpen(false)} open={open}>
                <DataTable data={data} />
            </Dialog>
        </>
    )
}
