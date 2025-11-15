// icons
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
// vendors
import dayjs, { Dayjs } from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import useSWR from 'swr'
import { useDebounce } from 'use-debounce'
// pages type
import type { DataType } from '@/app/(auth)/finances/wallets/page'
// components
import FlexColumnBox from '@/components/flex-column-box'
import InfoBox from '@/components/info-box'
import ScrollableXBox from '@/components/scrollable-x-box'
import Skeletons from '@/components/skeletons'
import TextField from '@/components/text-field'
// enums
import Wallet from '@/enums/permissions/Wallet'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import type TransactionORM from '@/modules/transaction/types/orms/transaction'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import PrintHandler from '../print-handler'
import WalletTxButtonAndForm from './TxButtonAndForm'
// components/TxHistory
import DatePickers, {
    DEFAULT_END_DATE,
    DEFAULT_START_DATE,
} from './TxHistory/DatePickers'
import TxHistoryItem from './TxHistory/Item'
import SummaryByTag from './TxHistory/summary-by-tag'
import CorrectionTxDataTable from './tx-form/correction-tx-datatable'
import InstallmentDataTable from './tx-form/installment-datatable'

export type ApiResponseType = {
    balanceFrom: number
    data: TransactionORM[]
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
    const isAuthHasPermission = useIsAuthHasPermission()
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
                            {isAuthHasPermission(
                                Wallet.CREATE_USER_WALLET_TRANSACTION,
                            ) && (
                                <WalletTxButtonAndForm
                                    data={walletData}
                                    disabled={loading}
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
                                    fromDate={fromDate}
                                    loading={loading}
                                    tab={activeTab}
                                    toDate={toDate}
                                    txs={txs}
                                    walletData={walletData}
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
                                color="success"
                                label="Rangkuman"
                                onClick={() => setActiveTab('rangkuman')}
                                size="small"
                                variant={
                                    activeTab === 'rangkuman'
                                        ? 'filled'
                                        : 'outlined'
                                }
                            />

                            <Chip
                                color="success"
                                label="Rincian"
                                onClick={() => setActiveTab('rincian')}
                                size="small"
                                variant={
                                    activeTab === 'rincian'
                                        ? 'filled'
                                        : 'outlined'
                                }
                            />
                        </ScrollableXBox>

                        <Body activeTab={activeTab} data={txs} />
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
                    component="div"
                    fontWeight="bold"
                    variant="h4">
                    {numberToCurrency(data.balance ?? 0)}
                </Typography>
            </Box>

            {!!data.unpaid_installment_total_rp && (
                <Box>
                    <Typography color="text.disabled" variant="caption">
                        Total Angsuran:
                    </Typography>

                    <Button
                        color="warning"
                        onClick={() => setIsPiutangDialogOpen(true)}
                        size="small"
                        sx={{
                            ml: 1,
                        }}
                        variant="outlined">
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
                        color="warning"
                        onClick={() => setIsCorrectionDialogOpen(true)}
                        size="small"
                        sx={{
                            ml: 1,
                        }}
                        variant="outlined">
                        {numberToCurrency(data.correction_total_rp)}
                    </Button>
                </Box>
            )}

            <Dialog
                fullWidth
                maxWidth="md"
                onClose={() => setIsPiutangDialogOpen(false)}
                open={isPiutangDialogOpen}>
                <InstallmentDataTable userUuid={data.user_uuid} />
            </Dialog>

            <Dialog
                fullWidth
                maxWidth="md"
                onClose={() => setIsCorrectionDialogOpen(false)}
                open={isCorrectionDialogOpen}>
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
            <Fade exit={false} in={activeTab === 'rangkuman'} unmountOnExit>
                <span>
                    <SummaryByTag data={txs} />
                </span>
            </Fade>

            <Fade exit={false} in={activeTab === 'rincian'} unmountOnExit>
                <span>
                    <FlexColumnBox>
                        <Box>
                            <Typography
                                color="text.disabled"
                                component="div"
                                fontWeight="bold"
                                lineHeight="1em"
                                mb={0.5}
                                variant="overline">
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
                                        onChange={({ target }) =>
                                            setSearchTerm(target.value)
                                        }
                                        placeholder="Cari..."
                                        required={false}
                                        value={searchTerm}
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
                                    exit={false}
                                    in={!showSearch}
                                    unmountOnExit>
                                    <SearchIcon />
                                </Fade>

                                <Fade
                                    exit={false}
                                    in={showSearch}
                                    unmountOnExit>
                                    <CloseIcon />
                                </Fade>
                            </IconButton>
                        </Box>

                        <Box>
                            <Typography
                                color="text.disabled"
                                component="div"
                                fontWeight="bold"
                                lineHeight="1em"
                                variant="overline">
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
        data: TransactionORM[]
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
                    amount={txs.balanceFrom}
                    desc="Saldo Awal"
                    slotProps={{
                        chip: {
                            size: 'medium',
                        },
                        typography: {
                            variant: 'body1',
                        },
                    }}
                />
            )}

            {txs?.data && txs.data.length > 0 ? (
                txsGroups.map(txsGroup => {
                    const dailyTotal = txsGroup.txs.reduce(
                        (acc, tx) => acc + tx.amount,
                        0,
                    )

                    return (
                        <FlexColumnBox gap={2} key={txsGroup.date}>
                            <Box
                                sx={{
                                    backgroundColor:
                                        'var(--mui-palette-background-paper)',
                                    backgroundImage: 'var(--mui-overlays-24)',
                                    borderBottomLeftRadius: '4px',
                                    borderBottomRightRadius: '4px',
                                    color: 'success.main',
                                    mt: 1.5,
                                    position: 'sticky',
                                    top: 0,
                                }}>
                                <Box
                                    alignItems="center"
                                    display="flex"
                                    justifyContent="space-between"
                                    sx={{
                                        borderColor: 'success.main',
                                        borderRadius: '4px',
                                        borderStyle: 'solid',
                                        borderWidth: '1px',
                                        px: 1,
                                        py: 0.2,
                                    }}>
                                    <Typography
                                        component="div"
                                        fontWeight="bold"
                                        lineHeight="inherit"
                                        variant="body2">
                                        {txsGroup.date}
                                    </Typography>

                                    <Typography
                                        color={
                                            dailyTotal < 0
                                                ? 'text.secondary'
                                                : 'success'
                                        }
                                        component="div"
                                        fontWeight="bold"
                                        lineHeight="inherit"
                                        variant="caption">
                                        {numberToCurrency(dailyTotal)}
                                    </Typography>
                                </Box>
                            </Box>

                            {txsGroup.txs.map(tx => (
                                <TxHistoryItem
                                    amount={tx.amount}
                                    desc={tx.desc}
                                    key={tx.uuid}
                                    tags={tx.tags.map(tag => tag.name.id)}
                                />
                            ))}
                        </FlexColumnBox>
                    )
                })
            ) : (
                <Typography
                    color="text.disabled"
                    component="div"
                    fontStyle="italic"
                    maxWidth="20em"
                    variant="caption">
                    Tidak terdapat aktivitas transaksi pada rentang tanggal yang
                    dipilih
                </Typography>
            )}

            {txs.balanceTo !== undefined && (
                <TxHistoryItem
                    amount={txs.balanceTo}
                    desc="Saldo Akhir"
                    mt={2}
                    slotProps={{
                        chip: {
                            size: 'medium',
                        },
                        typography: {
                            variant: 'body1',
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
            ml="-3px"
            sx={{
                '*': {
                    lineHeight: '1.1em',
                },
            }}
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
                    alt="logo"
                    height={0}
                    priority
                    sizes="100vw"
                    src="/assets/pwa-icons/green-transparent.svg"
                    style={{ height: '6em', width: '6em' }}
                    width={0}
                />

                <FlexColumnBox gap={1}>
                    <Typography>{title}</Typography>
                    <Box>
                        <Typography
                            color="text.disabled"
                            component="div"
                            variant="caption">
                            Periode Transaksi:
                        </Typography>
                        <Typography component="div" variant="caption">
                            {dateRangeText}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            color="text.disabled"
                            component="div"
                            variant="caption">
                            Waktu Cetak:
                        </Typography>
                        <Typography component="div" variant="caption">
                            {dayjs().format('DD-MM-YYYY HH:mm:ss')}
                        </Typography>
                    </Box>
                </FlexColumnBox>
            </Box>

            <FlexColumnBox gap={2}>
                <Box mt={1}>
                    <Typography
                        color="text.disabled"
                        component="div"
                        variant="caption">
                        Nama:
                    </Typography>
                    <Typography
                        component="div"
                        fontWeight="bold"
                        variant="body1">
                        #{walletData.user?.id} &mdash; {walletData.user?.name}
                    </Typography>
                </Box>

                {!loading && txs && <Body activeTab={activeTab} data={txs} />}
            </FlexColumnBox>
        </>
    )
}
