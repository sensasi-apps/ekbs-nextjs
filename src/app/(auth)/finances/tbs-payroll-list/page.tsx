'use client'

//icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
// materials
import Box from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import dayjs from 'dayjs'
// vendors
// vendors
import { useRouter, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
// components
import DatePicker from '@/components/date-picker'
import FlexColumnBox from '@/components/flex-column-box'
import SelectFromApi from '@/components/Global/SelectFromApi'
import IconButton from '@/components/icon-button'
import InfoBox from '@/components/info-box'
import PageTitle from '@/components/page-title'
import PrintHandler from '@/components/print-handler'
import ScrollToTopFab from '@/components/ScrollToTopFab'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
// types
import type { Ymd } from '@/types/date-string'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'

const ApiUrl = '/transactions/gajian-tbs/data'

export default function TbsPayrollList() {
    const searchParams = useSearchParams()

    const at = searchParams?.get('at')
    const to_cash_uuid = searchParams?.get('to_cash_uuid')

    const { data, isLoading } = useSWR<TransactionORM[]>(
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
        <>
            <PageTitle title="Daftar Gajian TBS" />
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
                                        mb={2}
                                    />
                                    <MainTable data={data} />
                                </PrintHandler>
                                <IconButton
                                    color="success"
                                    download
                                    href={downloadUrl}
                                    icon={BackupTableIcon}
                                    title="Download Excel"
                                />
                            </Box>
                            <MainTable data={data} />
                        </>
                    )}

                    {(!at || !to_cash_uuid) && <i>Silakan melengkapi isian</i>}
                </Box>
            </FlexColumnBox>

            <ScrollToTopFab />
        </>
    )
}

function FilterForm({ disabled }: { disabled: boolean }) {
    const { replace } = useRouter()

    const searchParams = useSearchParams()
    const at = searchParams?.get('at')
    const to_cash_uuid = searchParams?.get('to_cash_uuid')

    return (
        <Box maxWidth={300}>
            <DatePicker
                disabled={disabled}
                label="Tanggal"
                maxDate={dayjs().endOf('month')}
                name="at"
                onChange={date =>
                    replace(
                        `?at=${date?.format('YYYY-MM-DD')}&to_cash_uuid=${to_cash_uuid}`,
                    )
                }
                value={at ? dayjs(at as string) : null}
            />

            <SelectFromApi
                disabled={disabled}
                endpoint="/data/cashes"
                label="Melalui Kas"
                margin="dense"
                onChange={({ target }) => {
                    const value =
                        'value' in target ? (target.value as string) : ''

                    replace(`?at=${at}&to_cash_uuid=${value}`)
                }}
                required
                selectProps={{
                    id: 'cashSelect',
                    name: 'to_cash_uuid',
                    value: to_cash_uuid ?? '',
                }}
                size="small"
            />
        </Box>
    )
}

function MainTable({ data: txs }: { data: TransactionORM[] }) {
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
                                <TableRow key={tx.uuid}>
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
                            <TableCell align="center" colSpan={4}>
                                <i>Tidak ada data</i>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell align="center" colSpan={3}>
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
