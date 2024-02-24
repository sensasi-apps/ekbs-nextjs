// types
import type Transaction from '@/dataTypes/Transaction'
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
// icons
import BackupTableIcon from '@mui/icons-material/BackupTable'
// components
import DatePicker from '@/components/DatePicker'
import Skeletons from '@/components/Global/Skeletons'
// components/TxHistory
import TxHistoryItem from './TxHistory/Item'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'
import debounce from '@/utils/debounce'
import PrintHandler from '../PrintHandler'

const DEFAULT_START_DATE = dayjs().startOf('month')
const DEFAULT_END_DATE = dayjs()

type ApiResponseType = {
    balanceFrom: number
    data: Transaction[]
    balanceTo: number
}

export default function TxHistory({
    walletData,
    canPrint,
    canExportExcel,
}: {
    walletData: WalletType
    canPrint?: boolean
    canExportExcel?: boolean
}) {
    const [fromDate, setFromDate] = useState(DEFAULT_START_DATE)
    const [toDate, setToDate] = useState(DEFAULT_END_DATE)

    const { data: txs, isLoading } = useSWR<ApiResponseType>(
        walletData?.uuid
            ? `/wallets/transactions/${
                  walletData.uuid
              }?fromDate=${fromDate.format(
                  'YYYY-MM-DD',
              )}&toDate=${toDate.format('YYYY-MM-DD')}`
            : null,
        {
            keepPreviousData: true,
        },
    )

    return (
        <Box>
            <Header data={walletData} />

            <Box mb={0.2} display="flex" gap={2}>
                <DatePicker
                    disabled={isLoading}
                    minDate={dayjs('2023-01-01')}
                    maxDate={toDate}
                    value={fromDate}
                    label="Dari"
                    onChange={date =>
                        debounce(() => setFromDate(date ?? DEFAULT_START_DATE))
                    }
                />

                <DatePicker
                    disabled={isLoading}
                    value={toDate}
                    minDate={fromDate}
                    maxDate={dayjs()}
                    onChange={date =>
                        debounce(() => setToDate(date ?? DEFAULT_END_DATE))
                    }
                    label="Hingga"
                />
            </Box>

            {(canPrint || canExportExcel) && (
                <Box textAlign="end" mb={2}>
                    {canPrint && (
                        <PrintHandler
                            slotProps={{
                                printButton: {
                                    disabled: isLoading,
                                },
                            }}>
                            <Header data={walletData} />
                            {!isLoading && txs && <TxsList data={txs} />}
                        </PrintHandler>
                    )}

                    {canExportExcel && (
                        <Tooltip title="Ekspor Excel">
                            <span>
                                <IconButton
                                    disabled={isLoading}
                                    color="primary"
                                    href={`${
                                        process.env.NEXT_PUBLIC_BACKEND_URL
                                    }/wallets/transactions/${walletData?.uuid}?fromDate=${fromDate?.format(
                                        'YYYY-MM-DD',
                                    )}&toDate=${toDate?.format(
                                        'YYYY-MM-DD',
                                    )}&download=true`}
                                    download>
                                    <BackupTableIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Box>
            )}

            {isLoading && <Skeletons />}
            {!isLoading && txs && <TxsList data={txs} />}
        </Box>
    )
}

let dateTemp: string

function Header({ data }: { data: WalletType | undefined }) {
    return (
        <Box textAlign="center" mb={3}>
            <Typography color="text.disabled">Saldo</Typography>
            <Typography color="text.secondary">{data?.user?.name}</Typography>
            <Typography
                color="text.primary"
                variant="h4"
                fontWeight="bold"
                component="div">
                {numberToCurrency(data?.balance ?? 0)}
            </Typography>
        </Box>
    )
}

function TxsList({ data: txs }: { data: ApiResponseType }) {
    return (
        <>
            <TxHistoryItem mb={2} desc="Saldo Awal" amount={txs.balanceFrom} />

            {txs?.data && txs.data.length > 0 ? (
                <Box display="flex" flexDirection="column" gap={1}>
                    {txs.data.map(tx => (
                        <div key={tx.uuid}>
                            {dateHandler(tx.at)}

                            <TxHistoryItem desc={tx.desc} amount={tx.amount} />
                        </div>
                    ))}
                </Box>
            ) : (
                <Typography
                    fontStyle="italic"
                    textAlign="center"
                    color="text.secondary">
                    Tidak ada data transaksi
                </Typography>
            )}

            <TxHistoryItem mt={2} desc="Saldo Akhir" amount={txs.balanceTo} />
        </>
    )
}

function dateHandler(date: Transaction['at']) {
    if (dateTemp !== toDmy(date)) {
        dateTemp = toDmy(date)
        return (
            <Box color="text.disabled" fontWeight="bold" mb={0.5} mt={1.5}>
                {dateTemp}
            </Box>
        )
    }
}
