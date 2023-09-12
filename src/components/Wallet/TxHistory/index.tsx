import { FC } from 'react'
import moment, { Moment } from 'moment'
import useSWR from 'swr'
import ReactToPrint from 'react-to-print'
import 'moment/locale/id'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

import PrintIcon from '@mui/icons-material/Print'
import BackupTableIcon from '@mui/icons-material/BackupTable'

import DatePicker from '@/components/Global/DatePicker'
import NumericFormat from '@/components/Global/NumericFormat'
import Skeletons from '@/components/Global/Skeletons'
import TransactionDataType from '@/dataTypes/Transaction'
import TxHistoryItem from './Item'

const TxHistory: FC<any> = ({
    walletData,
    printContent,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
}) => {
    const { data: txs = [], isLoading } = useSWR(
        walletData?.uuid
            ? `/wallets/transactions/${
                  walletData.uuid
              }?fromDate=${fromDate.format(
                  'YYYY-MM-DD',
              )}&toDate=${toDate.format('YYYY-MM-DD')}`
            : null,
        url => axios.get(url).then(res => res.data),
    )

    let dateTemp: undefined | string = undefined

    const dateHandler = (date: string | Moment) => {
        if (dateTemp !== moment(date).format('DD MMMM YYYY')) {
            dateTemp = moment(date).format('DD MMMM YYYY')
            return (
                <Box color="text.disabled" fontWeight="bold" mb={0.5} mt={1.5}>
                    {dateTemp}
                </Box>
            )
        }
    }

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
                    <NumericFormat
                        value={walletData?.balance}
                        prefix="Rp. "
                        decimalScale={0}
                        displayType="text"
                    />
                </Typography>
            </Box>

            <Box mb={0.2} display="flex" gap={2}>
                <DatePicker
                    disabled={isLoading}
                    format={undefined}
                    maxDate={toDate}
                    value={fromDate}
                    views={['month', 'year']}
                    label="Dari"
                    onChange={date => setFromDate(date)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: 'small',
                        },
                    }}
                />

                <DatePicker
                    disabled={isLoading}
                    format={undefined}
                    value={toDate}
                    minDate={fromDate}
                    onChange={date => setToDate(date)}
                    views={['month', 'year']}
                    label="Hingga"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: 'small',
                        },
                    }}
                />
            </Box>

            <Box textAlign="end" mb={2}>
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

            {!isLoading && (
                <TxHistoryItem
                    mb={2}
                    desc="Saldo Awal"
                    amount={txs.balanceFrom}
                />
            )}

            {txs?.data?.length === 0 && (
                <Box>
                    <Typography fontStyle="italic" textAlign="center">
                        Tidak ada data transaksi
                    </Typography>
                </Box>
            )}

            {txs?.data?.map((tx: TransactionDataType) => (
                <div key={tx.uuid}>
                    {dateHandler(tx.at)}

                    <TxHistoryItem
                        desc={tx.desc}
                        amount={tx.amount}
                        color={(tx.amount || 0) > 0 ? 'success' : undefined}
                    />
                </div>
            ))}

            {!isLoading && (
                <TxHistoryItem
                    mt={2}
                    desc="Saldo Akhir"
                    amount={txs.balanceTo}
                    variant="caption"
                />
            )}
        </div>
    )
}

export default TxHistory
