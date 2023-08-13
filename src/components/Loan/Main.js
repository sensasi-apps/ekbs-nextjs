import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

import PropTypes from 'prop-types'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fab from '@mui/material/Fab'
import Fade from '@mui/material/Fade'
import IconButton from '@mui/material/IconButton'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'

import CloseIcon from '@mui/icons-material/Close'
import PaymentsIcon from '@mui/icons-material/Payments'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Loan from '@/classes/loan'
import Installment from '@/classes/Installment'

import LoanSummaryCard from '@/components/Loan/SummaryCard'
import ActiveInstallmentsBox from '../Installment/ActivesBox'

const LoanForm = dynamic(() => import('@/components/Loan/Form'))
const LoanDatatable = dynamic(() => import('./Datatable'))

import isProduction from '@/lib/isProduction'
import dynamic from 'next/dynamic'

const SkeletonsBox = () => (
    <Box
        sx={{
            '& > *': {
                mb: 2,
            },
        }}>
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={80} />
        <Skeleton variant="rounded" height={80} />
    </Box>
)

const EmptyCard = ({ name }) => (
    <Card>
        <CardContent
            sx={{
                textAlign: 'center',
            }}>
            <Typography component="i">Belum ada data {name}</Typography>
        </CardContent>
    </Card>
)

const TabChip = ({ label, tabId }) => {
    const router = useRouter()
    const isTabActive = router.query.tab && router.query.tab[0] === tabId

    return (
        <Chip
            label={label}
            variant="outlined"
            color={isTabActive ? 'success' : 'default'}
            onClick={
                isTabActive
                    ? undefined
                    : () => router.push(`/user-loans/${tabId}`)
            }
            icon={isTabActive ? <VisibilityIcon /> : null}
        />
    )
}

const LoanMain = ({ mode }) => {
    const router = useRouter()

    const [tab, setTab] = useState(undefined)
    const [draftLoan, setDraftLoan] = useState(undefined)

    const { data, isLoading, isValidating } = useSWR(
        mode === 'applier'
            ? '/loans/get-unfinished-data'
            : '/user-loans/get-unfinished-data',
        url => axios.get(url).then(res => res.data),
        {
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (router.isReady) {
            const tab = router.query.tab ? router.query.tab[0] : undefined
            if (tab) {
                setTab(tab)
            } else {
                router.replace('/user-loans/histories')
            }
        }
    }, [router])

    const isValidatingProduction = isValidating && isProduction

    const {
        submits = [],
        disbursement_wait_list = [],
        active_installments = [],
    } = data || {}

    const submitLoans = submits.map(loan => new Loan(loan))
    const disbursementWaitList = disbursement_wait_list.map(
        loan => new Loan(loan),
    )
    const activeInstallments = active_installments.map(
        installment => new Installment(installment),
    )

    return (
        <>
            <Box
                display="flex"
                gap={1}
                mb={2}
                sx={{
                    overflowX: 'auto',
                }}>
                <Fade in={submitLoans.length > 0} unmountOnExit exit={false}>
                    <div>
                        <TabChip
                            label={`Menunggu Persetujuan (${submitLoans.length})`}
                            tabId="review-waits"
                        />
                    </div>
                </Fade>

                <Fade
                    in={disbursementWaitList.length > 0}
                    unmountOnExit
                    exit={false}>
                    <div>
                        <TabChip
                            label={`Menunggu Pencairan (${disbursementWaitList.length})`}
                            tabId="disburse-waits"
                        />
                    </div>
                </Fade>

                <Fade
                    in={activeInstallments.length > 0}
                    unmountOnExit
                    exit={false}>
                    <div>
                        <TabChip
                            label={`Angsuran Aktif (${activeInstallments.length})`}
                            tabId="installments"
                        />
                    </div>
                </Fade>

                <TabChip label="Riwayat" tabId="histories" />
            </Box>

            <Fade in={tab === 'review-waits'} unmountOnExit exit={false}>
                <Box>
                    {(isLoading || isValidatingProduction) && <SkeletonsBox />}

                    {submits?.length === 0 &&
                        !isLoading &&
                        !isValidatingProduction && (
                            <EmptyCard name="ajuan pinjaman" />
                        )}

                    {submits?.length > 0 &&
                        !isLoading &&
                        !isValidatingProduction &&
                        submitLoans.map((loan, index) => (
                            <LoanSummaryCard
                                key={index}
                                data={loan}
                                mode={mode}
                                handleEdit={() => setDraftLoan(loan)}
                                sx={{
                                    mb: 4,
                                }}
                            />
                        ))}
                </Box>
            </Fade>

            <Fade in={tab === 'disburse-waits'} unmountOnExit exit={false}>
                <Box>
                    {(isLoading || isValidatingProduction) && <SkeletonsBox />}

                    {disbursement_wait_list?.length === 0 &&
                        !isLoading &&
                        !isValidatingProduction && (
                            <EmptyCard name="pinjaman yang siap dicairkan" />
                        )}

                    {disbursement_wait_list?.length > 0 &&
                        !isLoading &&
                        !isValidatingProduction &&
                        disbursementWaitList.map((loan, index) => (
                            <LoanSummaryCard
                                key={index}
                                data={loan}
                                mode={mode}
                                handleEdit={() => setDraftLoan(loan)}
                                sx={{
                                    mb: 4,
                                }}
                            />
                        ))}
                </Box>
            </Fade>

            <Fade in={tab === 'installments'} unmountOnExit exit={false}>
                <ActiveInstallmentsBox
                    data={activeInstallments}
                    isLoading={isLoading || isValidatingProduction}
                    mode={mode}
                />
            </Fade>

            <Fade in={tab === 'histories'} unmountOnExit exit={false}>
                <Box>
                    <LoanDatatable
                        mode={mode}
                        onRowClick={dataRow => setDraftLoan(new Loan(dataRow))}
                    />
                </Box>
            </Fade>

            <Dialog open={draftLoan !== undefined} fullWidth maxWidth="xs">
                <DialogTitle display="flex" justifyContent="space-between">
                    {draftLoan?.uuid
                        ? 'Ubah Data Ajuan'
                        : 'Ajukan Pinjaman Baru'}
                    <IconButton
                        size="small"
                        onClick={() => setDraftLoan(undefined)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {draftLoan !== undefined && (
                        <LoanForm
                            data={draftLoan}
                            handleClose={() => setDraftLoan(undefined)}
                            mode={mode}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Fab
                disabled={
                    draftLoan !== undefined ||
                    isLoading ||
                    isValidatingProduction
                }
                onClick={() => {
                    setDraftLoan(new Loan())
                }}
                color="success"
                aria-label="Ajukan pinjaman baru"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <PaymentsIcon />
            </Fab>
        </>
    )
}

LoanMain.propTypes = {
    mode: PropTypes.oneOf(['applier', 'manager']).isRequired,
}

export default LoanMain
