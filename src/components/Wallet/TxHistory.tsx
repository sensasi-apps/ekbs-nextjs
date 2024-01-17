// types
import type { Dayjs } from 'dayjs'
import type WalletType from '@/dataTypes/Wallet'
import type TransactionDataType from '@/dataTypes/Transaction'
// vendors
import useSWR from 'swr'
import ReactToPrint from 'react-to-print'
import axios from '@/lib/axios'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
// icons
import PrintIcon from '@mui/icons-material/Print'
import BackupTableIcon from '@mui/icons-material/BackupTable'
// components
import DatePicker from '@/components/DatePicker'
import Skeletons from '@/components/Global/Skeletons'
// components/TxHistory
import TxHistoryItem from './TxHistory/Item'
// utils
import toDmy from '@/utils/toDmy'
import numberToCurrency from '@/utils/numberToCurrency'

function TxHistory({
    walletData,
    printContent,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
}: {
    walletData: WalletType
    printContent?: any
    fromDate: Dayjs
    setFromDate: any
    toDate: Dayjs
    setToDate: any
}) {
    const { data: txs = [], isLoading } = useSWR(
        walletData?.uuid
            ? `/wallets/transactions/${
                  walletData.uuid
              }?fromDate=${fromDate.format(
                  'YYYY-MM-DD',
              )}&toDate=${toDate.format('YYYY-MM-DD')}`
            : null,
        url => axios.get(url).then(res => res.data),
        {
            keepPreviousData: true,
        },
    )

    return (
        <div>
            <Box textAlign="center" mb={3}>
                <Typography color="text.disabled">Saldo</Typography>
                <Typography color="text.secondary">
                    {walletData?.user?.name}
                </Typography>
                <Typography
                    color="text.primary"
                    variant="h4"
                    fontWeight="bold"
                    component="div">
                    {numberToCurrency(walletData?.balance)}
                </Typography>
            </Box>

            <Box mb={0.2} display="flex" gap={2}>
                <DatePicker
                    disabled={isLoading}
                    format={'MMMM YYYY'}
                    maxDate={toDate}
                    value={fromDate}
                    openTo="month"
                    views={['year', 'month']}
                    label="Dari"
                    onChange={date => setFromDate(date)}
                />

                <DatePicker
                    disabled={isLoading}
                    format={'MMMM YYYY'}
                    value={toDate}
                    minDate={fromDate}
                    maxDate={dayjs().endOf('month')}
                    onChange={date => setToDate(date)}
                    openTo="month"
                    views={['year', 'month']}
                    label="Hingga"
                />
            </Box>

            <Box textAlign="end" mb={2}>
                {printContent && (
                    <ReactToPrint
                        pageStyle="@page { margin: auto; }"
                        content={printContent}
                        trigger={() => (
                            <Tooltip title="Cetak">
                                <span>
                                    <IconButton
                                        disabled={isLoading}
                                        color="primary">
                                        <PrintIcon />
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )}
                    />
                )}

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
            </Box>

            {isLoading && <Skeletons />}

            {!isLoading && txs?.data?.length === 0 && (
                <Typography
                    fontStyle="italic"
                    textAlign="center"
                    color="text.secondary">
                    Tidak ada data transaksi
                </Typography>
            )}

            {!isLoading && txs?.data?.length > 0 && (
                <>
                    <TxHistoryItem
                        mb={2}
                        desc="Saldo Awal"
                        amount={txs.balanceFrom}
                    />

                    <Box display="flex" flexDirection="column" gap={1}>
                        {txs.data.map((tx: TransactionDataType) => (
                            <div key={tx.uuid}>
                                {dateHandler(tx.at)}

                                <TxHistoryItem
                                    desc={tx.desc}
                                    amount={tx.amount}
                                />
                            </div>
                        ))}
                    </Box>

                    <TxHistoryItem
                        mt={2}
                        desc="Saldo Akhir"
                        amount={txs.balanceTo}
                    />
                </>
            )}
        </div>
    )
}

export default TxHistory

let dateTemp: string

const dateHandler = (date: TransactionDataType['at']) => {
    if (dateTemp !== toDmy(date)) {
        dateTemp = toDmy(date)
        return (
            <Box color="text.disabled" fontWeight="bold" mb={0.5} mt={1.5}>
                {dateTemp}
            </Box>
        )
    }
}
