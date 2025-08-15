'use client'

// types
import type User from '@/features/user/types/user'
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableFooter from '@mui/material/TableFooter'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
// components
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/PrintHandler'
import ScrollToTopFab from '@/components/ScrollToTopFab'
import ScrollableXBox from '@/components/ScrollableXBox'
import Skeletons from '@/components/Global/Skeletons'
// icons
import RefreshIcon from '@mui/icons-material/Refresh'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// utils
import toDmy from '@/utils/to-dmy'
import formatNumber from '@/utils/format-number'
import Image from 'next/image'

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
                        value={from}
                        slotProps={{
                            textField: {
                                fullWidth: false,
                            },
                        }}
                        onChange={date =>
                            replace(
                                `?from=${date?.format('YYYY-MM-DD')}&to=${to.format('YYYY-MM-DD')}`,
                            )
                        }
                    />
                    <DatePicker
                        disabled={isLoading || isValidating}
                        label="Hingga"
                        value={to}
                        slotProps={{
                            textField: {
                                fullWidth: false,
                            },
                        }}
                        onChange={date =>
                            replace(`?to=${date?.format('YYYY-MM-DD')}`)
                        }
                    />
                    <IconButton
                        title="Refresh"
                        icon={RefreshIcon}
                        onClick={() => mutate()}
                        disabled={isLoading || isValidating}
                    />
                </ScrollableXBox>

                <Stack direction="row" gap={1}>
                    <PrintHandler
                        slotProps={{
                            printButton: {
                                disabled:
                                    isLoading ||
                                    isValidating ||
                                    (data?.length ?? 0) === 0,
                                color: 'success',
                            },
                        }}>
                        <FlexColumnBox>
                            <Stack direction="row" alignItems="center">
                                <Image
                                    src="/assets/pwa-icons/green-transparent.svg"
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{ width: '6em', height: '6em' }}
                                    alt="logo"
                                    priority
                                />

                                <Stack direction="column">
                                    <Typography variant="h6" component="h1">
                                        Laporan Bobot TBS
                                    </Typography>

                                    <Typography variant="caption" component="p">
                                        Periode: {toDmy(from)} - {toDmy(to)}
                                    </Typography>

                                    <Typography variant="caption" component="p">
                                        Tanggal Cetak: {toDmy(dayjs())}
                                    </Typography>
                                </Stack>
                            </Stack>

                            <MainTable data={data} />
                        </FlexColumnBox>
                    </PrintHandler>

                    <IconButton
                        title="Unduh Excel"
                        disabled={
                            isLoading ||
                            isValidating ||
                            (data?.length ?? 0) === 0
                        }
                        icon={BackupTableIcon}
                        color="success"
                        href={`${
                            process.env.NEXT_PUBLIC_BACKEND_URL
                        }/${API_URL}?from=${from.format(
                            'YYYY-MM-DD',
                        )}&to=${to.format('YYYY-MM-DD')}&excel=true`}
                        download
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
                            <TableCell colSpan={5} align="center">
                                <i>
                                    Tidak ada data pada rentang tanggal yang
                                    dipilih
                                </i>
                            </TableCell>
                        </TableRow>
                    )}
                    {data?.map(({ user_id, user_name, n_kg, n_tickets }, i) => (
                        <TableRow key={i}>
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
