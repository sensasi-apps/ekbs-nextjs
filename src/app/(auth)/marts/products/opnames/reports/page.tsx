'use client'

// icons-materials
import Download from '@mui/icons-material/Download'
import Refresh from '@mui/icons-material/Refresh'
// materials
import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import DatePicker from '@/components/DatePicker'
import IconButton from '@/components/icon-button'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/print-handler'
// enums
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
// utils
import aoaToXlsx from '@/utils/aoa-to-xlsx'
import formatNumber from '@/utils/format-number'

export default function OpnameReportPage() {
    const searchParams = useSearchParams()
    const from_at = searchParams?.get('from_at')
    const to_at = searchParams?.get('to_at')

    const swr = useSWR<OpnameReportItem[]>(
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

    const { data = [] } = swr

    const isLoading = swr.isLoading || swr.isValidating

    return (
        <>
            <PageTitle title="Laporan Opname per Kategori" />

            <BackButton />

            <Box alignItems="center" display="flex" mb={2} mt={1}>
                <FiltersBox isLoading={isLoading} mutate={swr.mutate} />

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
                    disabled={data.length === 0}
                    icon={Download}
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
                    title="Unduh Excel"
                />
            </Box>

            <Fade in={isLoading}>
                <LinearProgress />
            </Fade>

            <ReportTable data={data} />
        </>
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
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const from_at = searchParams?.get('from_at')
    const to_at = searchParams?.get('to_at')

    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null

    return (
        <Box
            sx={{ alignItems: 'center', display: 'flex', flexGrow: 1, gap: 2 }}>
            <DatePicker
                name="from_at"
                onChange={value =>
                    replace(
                        `?from_at=${value?.format('YYYY-MM-DD')}&to_at=${to_at}`,
                    )
                }
                value={from_at ? dayjs(from_at as string) : null}
            />
            <DatePicker
                name="to_at"
                onChange={value =>
                    replace(
                        `?from_at=${from_at}&to_at=${value?.format('YYYY-MM-DD')}`,
                    )
                }
                value={to_at ? dayjs(to_at as string) : null}
            />

            <IconButton
                disabled={!from_at || !to_at || isLoading}
                icon={Refresh}
                onClick={() => mutate()}
                title="Segarkan"
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
                            <TableCell align="center" colSpan={7}>
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
                            <TableRow key={category_name}>
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
                                        rp_total_found + rp_total_lost,
                                    )}
                                </TableCell>
                            </TableRow>
                        ),
                    )}
                </TableBody>

                <TableFooter>
                    <TableRow>
                        <TableCell align="right" colSpan={2}>
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
                                        acc + rp_total_found + rp_total_lost,
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
