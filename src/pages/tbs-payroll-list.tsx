// types
import type { Ymd } from '@/types/DateString'
import type TransactionType from '@/dataTypes/Transaction'
// vendors
import { useRouter } from 'next/router'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
// import Fab from '@mui/material/Fab'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import DatePicker from '@/components/DatePicker'
import FlexColumnBox from '@/components/FlexColumnBox'
import IconButton from '@/components/IconButton'
import PrintHandler from '@/components/PrintHandler'
import SelectFromApi from '@/components/Global/SelectFromApi'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
//icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
import InfoBox from '@/components/InfoBox'
import toDmy from '@/utils/toDmy'
import ScrollToTopFab from '@/components/ScrollToTopFab'

const ApiUrl = '/transactions/gajian-tbs/data'

export default function TbsPayrollList() {
    const {
        query: { at, to_cash_uuid },
    } = useRouter()

    const { data, isLoading } = useSWR<TransactionType[]>(
        at && to_cash_uuid
            ? [
                  ApiUrl,
                  {
                      at,
                      to_cash_uuid,
                  },
              ]
            : undefined,
    )

    const downloadUrl = new URL(process.env.NEXT_PUBLIC_BACKEND_URL + ApiUrl)
    downloadUrl.search = new URLSearchParams({
        at: at as string,
        to_cash_uuid: to_cash_uuid as string,
        to_excel: 'true',
    }).toString()

    return (
        <AuthLayout title="Daftar Gajian TBS">
            <FlexColumnBox gap={3}>
                <Box>
                    <FilterForm disabled={isLoading} />
                </Box>
                <Box>
                    {isLoading && (
                        <>
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </>
                    )}

                    {data && (
                        <>
                            <Box>
                                <PrintHandler
                                    slotProps={{
                                        printButton: {
                                            color: 'success',
                                        },
                                    }}>
                                    <InfoBox
                                        mb={2}
                                        data={[
                                            {
                                                label: 'TGL',
                                                value: at
                                                    ? toDmy(at as Ymd)
                                                    : '',
                                            },
                                            {
                                                label: 'Melalui Kas',
                                                value: document.getElementById(
                                                    'cashSelect',
                                                )?.innerText,
                                            },
                                        ]}
                                    />
                                    <MainTable data={data} />
                                </PrintHandler>
                                <IconButton
                                    title="Download Excel"
                                    icon={BackupTableIcon}
                                    color="success"
                                    href={downloadUrl}
                                    download
                                />
                            </Box>
                            <MainTable data={data} />
                        </>
                    )}

                    {(!at || !to_cash_uuid) && <i>Silahkan melengkapi isian</i>}
                </Box>
            </FlexColumnBox>

            <ScrollToTopFab />
        </AuthLayout>
    )
}

function FilterForm({ disabled }: { disabled: boolean }) {
    const {
        query: { at, to_cash_uuid },
        replace,
    } = useRouter()

    return (
        <Box maxWidth={300}>
            <DatePicker
                name="at"
                value={at ? dayjs(at as string) : null}
                disabled={disabled}
                maxDate={dayjs().endOf('month')}
                label="Tanggal"
                onChange={date =>
                    replace({
                        query: {
                            at: date?.format('YYYY-MM-DD'),
                            to_cash_uuid,
                        },
                    })
                }
            />

            <SelectFromApi
                required
                endpoint="/data/cashes"
                label="Melalui Kas"
                size="small"
                margin="dense"
                disabled={disabled}
                onChange={({ target }) => {
                    const value =
                        'value' in target ? (target.value as string) : ''

                    replace({
                        query: {
                            at,
                            to_cash_uuid: value,
                        },
                    })
                }}
                selectProps={{
                    id: 'cashSelect',
                    value: to_cash_uuid ?? '',
                    name: 'to_cash_uuid',
                }}
            />
        </Box>
    )
}

function MainTable({ data: txs }: { data: TransactionType[] }) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell rowSpan={2}>#</TableCell>
                        <TableCell colSpan={2}>Pengguna</TableCell>
                        <TableCell rowSpan={2}>Jumlah</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {txs.length > 0 ? (
                        txs.map((tx, i) => {
                            const user =
                                tx.cashable && 'user' in tx.cashable
                                    ? tx.cashable.user
                                    : null

                            return (
                                <TableRow key={i}>
                                    <TableCell>{i + 1}</TableCell>
                                    <TableCell>{user?.id}</TableCell>
                                    <TableCell>{user?.name}</TableCell>
                                    <TableCell>
                                        {numberToCurrency(
                                            Math.abs(tx.amount ?? 0),
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} align="center">
                                <i>Tidak ada data</i>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={3} align="center">
                            TOTAL
                        </TableCell>
                        <TableCell>
                            {numberToCurrency(
                                txs.reduce(
                                    (acc, tx) => acc + Math.abs(tx.amount),
                                    0,
                                ) ?? 0,
                            )}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    )
}
