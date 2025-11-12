'use client'

import BackupTableIcon from '@mui/icons-material/BackupTable'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
// materials
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import dayjs from 'dayjs'
import Image from 'next/image'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import Skeletons from '@/components/Global/Skeletons'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/print-handler'
import ScrollableXBox from '@/components/ScrollableXBox'
import ScrollToTopFab from '@/components/ScrollToTopFab'
// types
import type User from '@/modules/user/types/orms/user'
import formatNumber from '@/utils/format-number'
// utils
import toDmy from '@/utils/to-dmy'

type ApiResponseType = {
    user_id: User['id']
    user_name: User['name']
    n_kg: number
    n_tickets: number
}[]

const API_URL = 'palm-bunches/reports/farmer-weights'

const DEFAULT_START_DATE = dayjs().startOf('month')
const DEFAULT_END_DATE = dayjs().endOf('month')

export default function FarmerWeights() {
    const { replace } = useRouter()
    const searchParams = useSearchParams()
    const query = Object.fromEntries(searchParams?.entries() ?? [])

    const from = query.from ? dayjs(query.from as string) : DEFAULT_START_DATE

    const to = query.to ? dayjs(query.to as string) : DEFAULT_END_DATE

    const { data, isLoading, isValidating, mutate } = useSWR<ApiResponseType>([
        API_URL,
        {
            from: query.from ?? DEFAULT_START_DATE.format('YYYY-MM-DD'),
            to: query.to ?? DEFAULT_END_DATE.format('YYYY-MM-DD'),
        },
    ])

    return (
        <>
            <PageTitle title="Laporan Bobot TBS" />
            <FlexColumnBox>
                <ScrollableXBox>
                    <DatePicker
                        disabled={isLoading || isValidating}
                        label="Dari"
                        onChange={date =>
                            replace(
                                `?from=${date?.format('YYYY-MM-DD')}&to=${to.format('YYYY-MM-DD')}`,
                            )
                        }
                        slotProps={{
                            textField: {
                                fullWidth: false,
                            },
                        }}
                        value={from}
                    />
                    <DatePicker
                        disabled={isLoading || isValidating}
                        label="Hingga"
                        onChange={date =>
                            replace(`?to=${date?.format('YYYY-MM-DD')}`)
                        }
                        slotProps={{
                            textField: {
                                fullWidth: false,
                            },
                        }}
                        value={to}
                    />
                    <IconButton
                        disabled={isLoading || isValidating}
                        icon={RefreshIcon}
                        onClick={() => mutate()}
                        title="Refresh"
                    />
                </ScrollableXBox>

                <Stack direction="row" gap={1}>
                    <PrintHandler
                        slotProps={{
                            printButton: {
                                color: 'success',
                                disabled:
                                    isLoading ||
                                    isValidating ||
                                    (data?.length ?? 0) === 0,
                            },
                        }}>
                        <FlexColumnBox>
                            <Stack alignItems="center" direction="row">
                                <Image
                                    alt="logo"
                                    height={0}
                                    priority
                                    sizes="100vw"
                                    src="/assets/pwa-icons/green-transparent.svg"
                                    style={{ height: '6em', width: '6em' }}
                                    width={0}
                                />

                                <Stack direction="column">
                                    <Typography component="h1" variant="h6">
                                        Laporan Bobot TBS
                                    </Typography>

                                    <Typography component="p" variant="caption">
                                        Periode: {toDmy(from)} - {toDmy(to)}
                                    </Typography>

                                    <Typography component="p" variant="caption">
                                        Tanggal Cetak: {toDmy(dayjs())}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <MainTable data={data} />
                        </FlexColumnBox>
                    </PrintHandler>

                    <IconButton
                        color="success"
                        disabled={
                            isLoading ||
                            isValidating ||
                            (data?.length ?? 0) === 0
                        }
                        download
                        href={`${
                            process.env.NEXT_PUBLIC_BACKEND_URL
                        }/${API_URL}?from=${from.format(
                            'YYYY-MM-DD',
                        )}&to=${to.format('YYYY-MM-DD')}&excel=true`}
                        icon={BackupTableIcon}
                        title="Unduh Excel"
                    />
                </Stack>

                {(isLoading || isValidating) && <Skeletons />}
                {!(isLoading || isValidating) && <MainTable data={data} />}
            </FlexColumnBox>

            <ScrollToTopFab />
        </>
    )
}

function MainTable({ data }: { data: ApiResponseType | undefined }) {
    if (!data) return 'Terjadi Kesalahan'

    const totalKg = data.reduce((acc, item) => acc + item.n_kg, 0)

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>#</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell>Jumlah Ticket</TableCell>
                        <TableCell>Subtotal Bobot (kg)</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 && (
                        <TableRow>
                            <TableCell align="center" colSpan={5}>
                                <i>
                                    Tidak ada data pada rentang tanggal yang
                                    dipilih
                                </i>
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.map(({ user_id, user_name, n_kg, n_tickets }, i) => (
                        <TableRow key={user_id}>
                            <TableCell>{i + 1}</TableCell>
                            <TableCell>{user_id}</TableCell>
                            <TableCell>{user_name}</TableCell>
                            <TableCell align="right">
                                {formatNumber(n_tickets)}
                            </TableCell>
                            <TableCell align="right">
                                {formatNumber(n_kg)}
                            </TableCell>
                        </TableRow>
                    ))}

                    {}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={4}>Total</TableCell>
                        <TableCell align="right">
                            {totalKg ? formatNumber(totalKg) : ''}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
