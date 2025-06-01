// types
import type { Transaction } from '@/dataTypes/Transaction'
// vendors
import { useDebounce } from 'use-debounce'
import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// icons
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
// components
import FlexColumnBox from '../FlexColumnBox'
import InfoBox from '../InfoBox'
import ScrollableXBox from '../ScrollableXBox'
import Skeletons from '@/components/Global/Skeletons'
import TextField from '../TextField'
// components/TxHistory
import DatePickers, {
    DEFAULT_END_DATE,
    DEFAULT_START_DATE,
} from './TxHistory/DatePickers'
import SummaryByTag from './TxHistory/summary-by-tag'
import TxHistoryItem from './TxHistory/Item'
import WalletTxButtonAndForm from './TxButtonAndForm'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import PrintHandler from '../PrintHandler'
import toDmy from '@/utils/toDmy'
// enums
import Wallet from '@/enums/permissions/Wallet'
// providers
import useAuth from '@/providers/Auth'
import InstallmentDataTable from './tx-form/installment-datatable'
// pages type
import type { DataType } from '@/pages/wallets'
import CorrectionTxDataTable from './tx-form/correction-tx-datatable'

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
    walletData: DataType
    canPrint?: boolean
    canExportExcel?: boolean
}) {
    const { userHasPermission } = useAuth()
    const [activeTab, setActiveTab] = useState<'rangkuman' | 'rincian'>(
        'rangkuman',
    )
    const [fromDate, setFromDate] = useState(DEFAULT_START_DATE)
    const [toDate, setToDate] = useState(DEFAULT_END_DATE)

    const [fromDateDebounced] = useDebounce(fromDate, 1000)
    const [toDateDebounced] = useDebounce(toDate, 1000)

    const {
        data: txs,
        isLoading,
        isValidating,
        mutate: mutateHistory,
    } = useSWR<ApiResponseType>([
        `/wallets/transactions/${walletDataCache.uuid}`,
        {
            fromDate: fromDateDebounced.format('YYYY-MM-DD'),
            toDate: toDateDebounced.format('YYYY-MM-DD'),
        },
    ])

    const {
        data: walletData = walletDataCache,
        isLoading: isWalletDataLoading,
        isValidating: isWalletDataValidating,
        mutate: mutateWalletData,
    } = useSWR<DataType>(`/wallets/user/${walletDataCache.user_uuid}`, null, {
        keepPreviousData: true,
    })

    const loading =
        isLoading ||
        isValidating ||
        isWalletDataLoading ||
        isWalletDataValidating

    return (
        <Box display="flex" gap={8}>
            <Header data={walletData} />

            <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" gap={2} mt={1}>
                    <DatePickers
                        disabled={loading}
                        fromDateUseState={[fromDate, setFromDate]}
                        toDateUseState={[toDate, setToDate]}
                        userCashUuid={walletData.uuid}
                    />
                </Box>

                {(canPrint || canExportExcel) && (
                    <Box display="inline-flex">
                        <Box flexGrow={1}>
                            {userHasPermission(
                                Wallet.CREATE_USER_WALLET_TRANSACTION,
                            ) && (
                                <WalletTxButtonAndForm
                                    disabled={loading}
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
                                <PrintTemplate
                                    tab={activeTab}
                                    walletData={walletData}
                                    fromDate={fromDate}
                                    toDate={toDate}
                                    loading={loading}
                                    txs={txs}
                                />
                            </PrintHandler>
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
                                    activeTab === 'rincian'
                                        ? 'filled'
                                        : 'outlined'
                                }
                                onClick={() => setActiveTab('rincian')}
                            />
                        </ScrollableXBox>

                        <Body data={txs} activeTab={activeTab} />
                    </>
                )}
            </Box>
        </Box>
    )
}

function Header({ data }: { data: DataType }) {
    const [isPiutangDialogOpen, setIsPiutangDialogOpen] = useState(false)
    const [isCorrectionDialogOpen, setIsCorrectionDialogOpen] = useState(false)

    return (
        <Box display="flex" flexDirection="column" gap={2}>
            <Typography>
                #{data.user?.id} &mdash; {data.user?.name}
            </Typography>

            <Box>
                <Typography color="text.disabled" variant="caption">
                    Saldo Saat Ini:
                </Typography>

                <Typography
                    color="text.primary"
                    variant="h4"
                    fontWeight="bold"
                    component="div">
                    {numberToCurrency(data.balance ?? 0)}
                </Typography>
            </Box>

            {!!data.unpaid_installment_total_rp && (
                <Box>
                    <Typography color="text.disabled" variant="caption">
                        Total Angsuran:
                    </Typography>

                    <Button
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{
                            ml: 1,
                        }}
                        onClick={() => setIsPiutangDialogOpen(true)}>
                        {numberToCurrency(data.unpaid_installment_total_rp)}
                    </Button>
                </Box>
            )}

            {!!data.correction_total_rp && (
                <Box>
                    <Typography color="text.disabled" variant="caption">
                        Total Koreksi:
                    </Typography>

                    <Button
                        size="small"
                        color="warning"
                        variant="outlined"
                        sx={{
                            ml: 1,
                        }}
                        onClick={() => setIsCorrectionDialogOpen(true)}>
                        {numberToCurrency(data.correction_total_rp)}
                    </Button>
                </Box>
            )}

            <Dialog
                open={isPiutangDialogOpen}
                maxWidth="md"
                fullWidth
                onClose={() => setIsPiutangDialogOpen(false)}>
                <InstallmentDataTable userUuid={data.user_uuid} />
            </Dialog>

            <Dialog
                open={isCorrectionDialogOpen}
                maxWidth="md"
                fullWidth
                onClose={() => setIsCorrectionDialogOpen(false)}>
                <CorrectionTxDataTable userUuid={data.user_uuid} />
            </Dialog>
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
    const [showSearch, setShowSearch] = useState(false)
    const [searchTerm, setSearchTerm] = useState<string>()

    const filteredTxs = searchTerm
        ? {
              data: txs.data.filter(
                  tx =>
                      tx.desc?.toLowerCase().includes(searchTerm) ||
                      tx.tags.some(tag =>
                          tag.name.id.toLowerCase().includes(searchTerm),
                      ),
              ),
          }
        : txs

    return (
        <>
            <Fade in={activeTab === 'rangkuman'} unmountOnExit exit={false}>
                <span>
                    <SummaryByTag data={txs} />
                </span>
            </Fade>

            <Fade in={activeTab === 'rincian'} unmountOnExit exit={false}>
                <span>
                    <FlexColumnBox>
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

                        <Box
                            display="flex"
                            justifyContent="end"
                            sx={{
                                displayPrint: 'none',
                            }}>
                            <Fade in={showSearch} unmountOnExit>
                                <Box width="100%">
                                    <TextField
                                        autoComplete="off"
                                        margin="none"
                                        required={false}
                                        placeholder="Cari..."
                                        value={searchTerm}
                                        onChange={({ target }) =>
                                            setSearchTerm(target.value)
                                        }
                                    />
                                </Box>
                            </Fade>

                            <IconButton
                                disableTouchRipple
                                onClick={() =>
                                    setShowSearch(prev => {
                                        if (prev) {
                                            setSearchTerm(undefined)
                                        }

                                        return !prev
                                    })
                                }>
                                <Fade
                                    in={!showSearch}
                                    unmountOnExit
                                    exit={false}>
                                    <SearchIcon />
                                </Fade>

                                <Fade
                                    in={showSearch}
                                    unmountOnExit
                                    exit={false}>
                                    <CloseIcon />
                                </Fade>
                            </IconButton>
                        </Box>

                        <Box>
                            <Typography
                                variant="overline"
                                lineHeight="1em"
                                color="text.disabled"
                                component="div"
                                fontWeight="bold">
                                Rincian
                            </Typography>

                            <TxsList data={filteredTxs} />
                        </Box>
                    </FlexColumnBox>
                </span>
            </Fade>
        </>
    )
}

function TxsList({
    data: txs,
}: {
    data: {
        balanceFrom?: number
        data: Transaction[]
        balanceTo?: number
    }
}) {
    const ats = txs.data
        .map(tx => toDmy(tx.at))
        .filter((v, i, a) => a.indexOf(v) === i)

    const txsGroups = ats.map(at => ({
        date: at,
        txs: txs.data.filter(tx => toDmy(tx.at) === at),
    }))

    return (
        <FlexColumnBox gap={1}>
            {txs.balanceFrom !== undefined && (
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
            )}

            {txs?.data && txs.data.length > 0 ? (
                txsGroups.map((txsGroup, i) => {
                    const dailyTotal = txsGroup.txs.reduce(
                        (acc, tx) => acc + tx.amount,
                        0,
                    )

                    return (
                        <FlexColumnBox gap={2} key={i}>
                            <Box
                                sx={{
                                    mt: 1.5,
                                    position: 'sticky',
                                    top: 0,
                                    backgroundColor:
                                        'var(--mui-palette-background-paper)',
                                    backgroundImage: 'var(--mui-overlays-24)',
                                    color: 'success.main',
                                    borderBottomRightRadius: '4px',
                                    borderBottomLeftRadius: '4px',
                                }}>
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    sx={{
                                        px: 1,
                                        py: 0.2,
                                        borderColor: 'success.main',
                                        borderWidth: '1px',
                                        borderStyle: 'solid',
                                        borderRadius: '4px',
                                    }}>
                                    <Typography
                                        lineHeight="inherit"
                                        variant="body2"
                                        fontWeight="bold"
                                        component="div">
                                        {txsGroup.date}
                                    </Typography>

                                    <Typography
                                        lineHeight="inherit"
                                        variant="caption"
                                        fontWeight="bold"
                                        color={
                                            dailyTotal < 0
                                                ? 'text.secondary'
                                                : 'success'
                                        }
                                        component="div">
                                        {numberToCurrency(dailyTotal)}
                                    </Typography>
                                </Box>
                            </Box>

                            {txsGroup.txs.map((tx, i) => (
                                <TxHistoryItem
                                    key={i}
                                    desc={tx.desc}
                                    amount={tx.amount}
                                    tags={tx.tags.map(tag => tag.name.id)}
                                />
                            ))}
                        </FlexColumnBox>
                    )
                })
            ) : (
                <Typography
                    color="text.disabled"
                    variant="caption"
                    fontStyle="italic"
                    maxWidth="20em"
                    component="div">
                    Tidak terdapat aktivitas transaksi pada rentang tanggal yang
                    dipilih
                </Typography>
            )}

            {txs.balanceTo !== undefined && (
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
            )}
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

type TabType = 'rangkuman' | 'rincian'

function PrintTemplate({
    tab: activeTab,
    fromDate,
    toDate,
    walletData,
    loading,
    txs,
}: {
    tab: TabType
    fromDate: Dayjs
    toDate: Dayjs
    walletData: DataType
    loading: boolean
    txs: ApiResponseType | undefined
}) {
    const title =
        (activeTab === 'rangkuman' ? 'Rangkuman' : 'Mutasi') + ' EKBS Wallet'

    const dateRangeText = `${toDmy(fromDate)} s/d ${toDmy(toDate)}`

    const windowTitle = `${title} — ${dateRangeText} — #${walletData.user?.id} — ${walletData.user?.name} — ${process.env.NEXT_PUBLIC_APP_NAME}`

    return (
        <>
            <Head>
                <title>{windowTitle}</title>
            </Head>

            <Box display="flex" gap={2}>
                <Image
                    src="/assets/pwa-icons/green-transparent.svg"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '6em', height: '6em' }}
                    alt="logo"
                    priority
                />

                <FlexColumnBox gap={1}>
                    <Typography>{title}</Typography>
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div">
                            Periode Transaksi:
                        </Typography>
                        <Typography variant="caption" component="div">
                            {dateRangeText}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div">
                            Waktu Cetak:
                        </Typography>
                        <Typography variant="caption" component="div">
                            {dayjs().format('DD-MM-YYYY HH:mm:ss')}
                        </Typography>
                    </Box>
                </FlexColumnBox>
            </Box>

            <FlexColumnBox gap={2}>
                <Box mt={1}>
                    <Typography
                        variant="caption"
                        color="text.disabled"
                        component="div">
                        Nama:
                    </Typography>
                    <Typography
                        variant="body1"
                        component="div"
                        fontWeight="bold">
                        #{walletData.user?.id} &mdash; {walletData.user?.name}
                    </Typography>
                </Box>

                {!loading && txs && <Body data={txs} activeTab={activeTab} />}
            </FlexColumnBox>
        </>
    )
}
