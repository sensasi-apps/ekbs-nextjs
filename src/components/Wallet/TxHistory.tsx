// types
import type Transaction from '@/dataTypes/Transaction'
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
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
import FlexColumnBox from '../FlexColumnBox'
import Wallet from '@/enums/permissions/Wallet'
import useAuth from '@/providers/Auth'
import WalletTxButtonAndForm from './TxButtonAndForm'

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
    onSubmit = () => {},
}: {
    walletData: WalletType
    canPrint?: boolean
    canExportExcel?: boolean
    onSubmit?: () => any
}) {
    const { userHasPermission } = useAuth()
    const [fromDate, setFromDate] = useState(DEFAULT_START_DATE)
    const [toDate, setToDate] = useState(DEFAULT_END_DATE)

    const {
        data: txs,
        isLoading,
        isValidating,
        mutate,
    } = useSWR<ApiResponseType>(
        walletData?.uuid
            ? [
                  `/wallets/transactions/${walletData.uuid}`,
                  {
                      fromDate: fromDate.format('YYYY-MM-DD'),
                      toDate: toDate.format('YYYY-MM-DD'),
                  },
              ]
            : null,
        {
            keepPreviousData: true,
        },
    )

    const loading = isLoading || isValidating

    return (
        <FlexColumnBox>
            <Header data={walletData} />

            <Box display="flex" gap={2}>
                <DatePicker
                    disabled={loading}
                    minDate={dayjs('2023-01-01')}
                    maxDate={toDate}
                    value={fromDate}
                    slotProps={{
                        textField: {
                            margin: 'none',
                        },
                    }}
                    label="Dari"
                    onChange={date =>
                        debounce(() => setFromDate(date ?? DEFAULT_START_DATE))
                    }
                />

                <DatePicker
                    disabled={loading}
                    value={toDate}
                    minDate={fromDate}
                    maxDate={dayjs()}
                    slotProps={{
                        textField: {
                            margin: 'none',
                        },
                    }}
                    onChange={date =>
                        debounce(() => setToDate(date ?? DEFAULT_END_DATE))
                    }
                    label="Hingga"
                />
            </Box>

            {(canPrint || canExportExcel) && (
                <Box display="inline-flex">
                    <Box flexGrow={1}>
                        {userHasPermission(
                            Wallet.CREATE_USER_WALLET_TRANSACTION,
                        ) && (
                            <WalletTxButtonAndForm
                                data={walletData}
                                onSubmit={() => {
                                    onSubmit()
                                    mutate()
                                }}
                            />
                        )}
                    </Box>

                    {canPrint && (
                        <PrintHandler
                            slotProps={{
                                printButton: {
                                    disabled: loading,
                                },
                            }}>
                            <Header data={walletData} />
                            {!loading && txs && <TxsList data={txs} />}
                        </PrintHandler>
                    )}

                    {canExportExcel && (
                        <Tooltip title="Ekspor Excel" placement="top" arrow>
                            <span>
                                <IconButton
                                    disabled={loading}
                                    color="inherit"
                                    size="small"
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

            {loading && <Skeletons />}
            {!loading && txs && <TxsList data={txs} />}
        </FlexColumnBox>
    )
}

function Header({ data }: { data: WalletType | undefined }) {
    return (
        <Box textAlign="center">
            <Typography color="text.disabled">Saldo</Typography>
            <Typography color="text.secondary">
                #{data?.user?.id} &mdash; {data?.user?.name}
            </Typography>
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
    let dateTemp = ''

    function dateHandler(date: Transaction['at']) {
        if (dateTemp !== toDmy(date)) {
            dateTemp = toDmy(date)
            return (
                <Divider
                    textAlign="left"
                    sx={{
                        mb: 0.8,
                    }}>
                    <Box color="text.disabled" fontWeight="bold">
                        {dateTemp}
                    </Box>
                </Divider>
            )
        }
    }

    return (
        <FlexColumnBox gap={1} mt={1}>
            <TxHistoryItem
                desc="Saldo Awal"
                amount={txs.balanceFrom}
                slotProps={{
                    typography: {
                        variant: 'body1',
                    },
                    chip: {
                        size: 'medium',
                    },
                }}
            />

            {txs?.data && txs.data.length > 0 ? (
                <FlexColumnBox gap={0.7}>
                    {txs.data.map(tx => (
                        <div key={tx.uuid}>
                            {dateHandler(tx.at)}

                            <TxHistoryItem desc={tx.desc} amount={tx.amount} />
                        </div>
                    ))}
                </FlexColumnBox>
            ) : (
                <Typography
                    fontStyle="italic"
                    textAlign="center"
                    color="text.secondary">
                    Tidak ada data transaksi
                </Typography>
            )}

            <TxHistoryItem
                mt={2}
                desc="Saldo Akhir"
                amount={txs.balanceTo}
                slotProps={{
                    typography: {
                        variant: 'body1',
                    },
                    chip: {
                        size: 'medium',
                    },
                }}
            />
        </FlexColumnBox>
    )
}
