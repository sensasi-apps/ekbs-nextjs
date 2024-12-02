// vendors
import {
    Box,
    Fade,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material'
import { Download, Refresh } from '@mui/icons-material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/IconButton'
import AuthLayout from '@/components/Layouts/AuthLayout'
import PrintHandler from '@/components/PrintHandler'
// enums
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
// utils
import { aoaToXlsx } from '@/functions/aoaToXlsx'
import formatNumber from '@/utils/formatNumber'
import BackButton from '@/components/BackButton'

export default function Opnames() {
    const {
        query: { from_at, to_at },
    } = useRouter()

    const {
        data = [],
        mutate,
        isLoading,
    } = useSWR<OpnameReportItem[]>(
        from_at && to_at
            ? [
                  OpnameApiUrl.REPORTS,
                  {
                      from_at: from_at as string,
                      to_at: to_at as string,
                  },
              ]
            : null,
    )

    return (
        <AuthLayout title="Laporan Opname per Kategori">
            <BackButton />

            <Box display="flex" alignItems="center" mb={2} mt={1}>
                <FiltersBox {...{ mutate, isLoading }} />

                <PrintHandler
                    slotProps={{
                        printButton: {
                            disabled: isLoading || data.length === 0,
                        },
                    }}>
                    {data.length > 0 && (
                        <>
                            <Typography variant="h6">
                                Laporan Opname per Kategori
                            </Typography>

                            <Typography variant="body2">
                                {from_at} s/d {to_at}
                            </Typography>

                            <ReportTable data={data} />
                        </>
                    )}
                </PrintHandler>

                <IconButton
                    title="Unduh Excel"
                    icon={Download}
                    disabled={data.length === 0}
                    onClick={() =>
                        aoaToXlsx(
                            `Laporan Opname per Kategori — ${from_at} s.d ${to_at}`,
                            data.map(item => Object.values(item)),
                            [
                                'Kategori',
                                'Qty Sistem',
                                'Qty Fisik',
                                'Nilai Selisih',
                            ],
                        )
                    }
                />
            </Box>

            <Fade in={isLoading}>
                <LinearProgress />
            </Fade>

            <ReportTable data={data} />
        </AuthLayout>
    )
}

interface OpnameReportItem {
    category_name: string
    system_qty: number
    physical_qty: number
    rp_total_found: number
    rp_total_lost: number
}

function FiltersBox({
    mutate,
    isLoading,
}: {
    mutate: () => void
    isLoading: boolean
}) {
    const {
        query: { from_at, to_at },
        replace,
    } = useRouter()

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <Box
            sx={{ display: 'flex', gap: 2, alignItems: 'center', flexGrow: 1 }}>
            <DatePicker
                name="from_at"
                value={from_at ? dayjs(from_at as string) : null}
                onChange={value =>
                    replace({
                        query: {
                            from_at: value?.format('YYYY-MM-DD'),
                            to_at: to_at,
                        },
                    })
                }
            />
            <DatePicker
                name="to_at"
                value={to_at ? dayjs(to_at as string) : null}
                onChange={value =>
                    replace({
                        query: {
                            from_at: from_at,
                            to_at: value?.format('YYYY-MM-DD'),
                        },
                    })
                }
            />

            <IconButton
                disabled={!from_at || !to_at || isLoading}
                title="Segarkan"
                icon={Refresh}
                onClick={mutate}
            />
        </Box>
    )
}

function ReportTable({ data }: { data: OpnameReportItem[] }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>Kategori Produk</TableCell>
                        <TableCell>Qty Sistem</TableCell>
                        <TableCell>Qty Fisik</TableCell>
                        <TableCell>Nilai Ditemukan (Rp)</TableCell>
                        <TableCell>Nilai Hilang (Rp)</TableCell>
                        <TableCell>Total Selisih (Rp)</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} align="center">
                                Tidak ada data
                            </TableCell>
                        </TableRow>
                    )}

                    {data.map(
                        (
                            {
                                category_name,
                                system_qty,
                                physical_qty,
                                rp_total_found,
                                rp_total_lost,
                            },
                            index,
                        ) => (
                            <TableRow key={index}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{category_name}</TableCell>
                                <TableCell align="right">
                                    {formatNumber(system_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatNumber(physical_qty)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatNumber(rp_total_found)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatNumber(rp_total_lost)}
                                </TableCell>
                                <TableCell align="right">
                                    {formatNumber(
                                        rp_total_found - rp_total_lost,
                                    )}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={2} align="right">
                            Total
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { system_qty }) => acc + system_qty,
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { physical_qty }) =>
                                        acc + physical_qty,
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { rp_total_found }) =>
                                        acc + rp_total_found,
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { rp_total_lost }) =>
                                        acc + rp_total_lost,
                                    0,
                                ),
                            )}
                        </TableCell>

                        <TableCell align="right">
                            {formatNumber(
                                data.reduce(
                                    (acc, { rp_total_found, rp_total_lost }) =>
                                        acc + rp_total_found - rp_total_lost,
                                    0,
                                ),
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
