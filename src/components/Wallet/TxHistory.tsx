// types
import type Transaction from '@/dataTypes/Transaction'
import type WalletType from '@/dataTypes/Wallet'
// vendors
import { useState } from 'react'
import useSWR from 'swr'
import dayjs from 'dayjs'
// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
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
import InfoBox from '../InfoBox'
import ScrollableXBox from '../ScrollableXBox'
import SummaryByTag from './TxHistory/SummaryByTag'

const DEFAULT_START_DATE = dayjs().startOf('month')
const DEFAULT_END_DATE = dayjs()

export type ApiResponseType = {
    balanceFrom: number
    data: Transaction[]
    balanceTo: number
}

export default function TxHistory({
    walletData: walletDataCache,
    canPrint,
    canExportExcel,
}: {
    walletData: WalletType
    canPrint?: boolean
    canExportExcel?: boolean
}) {
    const { userHasPermission } = useAuth()
    const [activeTab, setActiveTab] = useState<'rangkuman' | 'rincian'>(
        'rangkuman',
    )
    const [fromDate, setFromDate] = useState(DEFAULT_START_DATE)
    const [toDate, setToDate] = useState(DEFAULT_END_DATE)

    const {
        data: txs,
        isLoading,
        isValidating,
        mutate: mutateHistory,
    } = useSWR<ApiResponseType>(
        walletDataCache?.uuid
            ? [
                  `/wallets/transactions/${walletDataCache.uuid}`,
                  {
                      fromDate: fromDate.format('YYYY-MM-DD'),
                      toDate: toDate.format('YYYY-MM-DD'),
                  },
              ]
            : null,
        null,
        { keepPreviousData: true },
    )

    const {
        data: walletData = walletDataCache,
        isLoading: isWalletDataLoading,
        isValidating: isWalletDataValidating,
        mutate: mutateWalletData,
    } = useSWR<WalletType>(
        walletDataCache?.user_uuid
            ? `/wallets/user/${walletDataCache.user_uuid}`
            : null,
        null,
        { keepPreviousData: true },
    )

    const loading =
        isLoading ||
        isValidating ||
        isWalletDataLoading ||
        isWalletDataValidating

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
                                    mutateHistory()
                                    mutateWalletData()
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
                            <>
                                <FlexColumnBox gap={1}>
                                    <Typography>
                                        {activeTab === 'rangkuman'
                                            ? 'Rangkuman'
                                            : 'Mutasi'}{' '}
                                        EKBS Wallet
                                    </Typography>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                            component="div">
                                            Periode Transaksi:
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="div">
                                            {toDmy(fromDate)} s/d{' '}
                                            {toDmy(toDate)}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                            component="div">
                                            Waktu Cetak:
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            component="div">
                                            {dayjs().format(
                                                'DD-MM-YYYY HH:mm:ss',
                                            )}
                                        </Typography>
                                    </Box>
                                </FlexColumnBox>

                                <FlexColumnBox gap={2}>
                                    {activeTab === 'rincian' && (
                                        <Header data={walletData} />
                                    )}

                                    {!loading && txs && (
                                        <Body
                                            data={txs}
                                            activeTab={activeTab}
                                        />
                                    )}
                                </FlexColumnBox>
                            </>
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
            {!loading && txs && (
                <>
                    <ScrollableXBox>
                        <Chip
                            label="Rangkuman"
                            color="success"
                            size="small"
                            variant={
                                activeTab === 'rangkuman'
                                    ? 'filled'
                                    : 'outlined'
                            }
                            onClick={() => setActiveTab('rangkuman')}
                        />

                        <Chip
                            label="Rincian"
                            color="success"
                            size="small"
                            variant={
                                activeTab === 'rincian' ? 'filled' : 'outlined'
                            }
                            onClick={() => setActiveTab('rincian')}
                        />
                    </ScrollableXBox>

                    <Body data={txs} activeTab={activeTab} />
                </>
            )}
        </FlexColumnBox>
    )
}

function Header({ data }: { data: WalletType | undefined }) {
    return (
        <Box textAlign="center">
            <Typography color="text.disabled" variant="caption">
                Saldo Saat Ini:
            </Typography>
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

function Body({
    data: txs,
    activeTab,
}: {
    data: ApiResponseType
    activeTab: 'rangkuman' | 'rincian'
}) {
    return (
        <>
            <Fade in={activeTab === 'rangkuman'} unmountOnExit>
                <span>
                    <SummaryByTag data={txs} />
                </span>
            </Fade>

            <Fade in={activeTab === 'rincian'} unmountOnExit>
                <span>
                    <Box>
                        <Typography
                            lineHeight="1em"
                            variant="overline"
                            color="text.disabled"
                            component="div"
                            fontWeight="bold"
                            mb={0.5}>
                            Rangkuman
                        </Typography>
                        <SummaryTable data={txs} />
                    </Box>

                    <Box mt={1.5}>
                        <Typography
                            variant="overline"
                            lineHeight="1em"
                            color="text.disabled"
                            component="div"
                            fontWeight="bold">
                            Rincian
                        </Typography>
                        <TxsList data={txs} />
                    </Box>
                </span>
            </Fade>
        </>
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
        <FlexColumnBox gap={1}>
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
                <FlexColumnBox gap={1}>
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

function SummaryTable({ data }: { data: ApiResponseType }) {
    return (
        <InfoBox
            ml="-3px"
            sx={{
                '*': {
                    lineHeight: '1.1em',
                },
            }}
            data={[
                {
                    label: 'Saldo Awal',
                    value: numberToCurrency(data.balanceFrom),
                },
                {
                    label: 'Saldo Masuk',
                    value: numberToCurrency(
                        data.data
                            .filter(tx => tx.amount > 0)
                            .reduce((acc, tx) => acc + tx.amount, 0),
                    ),
                },
                {
                    label: 'Saldo Keluar',
                    value: numberToCurrency(
                        data.data
                            .filter(tx => tx.amount < 0)
                            .reduce((acc, tx) => acc + tx.amount, 0),
                    ),
                },
                {
                    label: 'Saldo Akhir',
                    value: numberToCurrency(data.balanceTo),
                },
            ]}
        />
    )
}
