import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import PropTypes from 'prop-types'

import { TransitionGroup } from 'react-transition-group'

import {
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    Fade,
    IconButton,
    Skeleton,
    Typography,
} from '@mui/material'

import CloseIcon from '@mui/icons-material/Close'
import PaymentsIcon from '@mui/icons-material/Payments'
import VisibilityIcon from '@mui/icons-material/Visibility'

import Loan from '@/classes/loan'
import Installment from '@/classes/Installment'

import LoanSummaryCard from '@/components/Loan/SummaryCard'
// import LoanForm from '@/components/Loan/Form'
import ActiveInstallmentsBox from '../Installment/ActivesBox'
// import LoanDatatable from './Datatable'

const LoanForm = dynamic(() => import('@/components/Loan/Form'))
// const ActiveInstallmentsBox = dynamic(() => import('../Installment/ActivesBox'))
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

const LoanMain = ({ mode }) => {
    const [tabIndexActive, setTabIndexActive] = useState(
        mode === 'manager' ? 0 : 2,
    )
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

    // elements
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

    const Chips = () => {
        const chip1 =
            'Menunggu Persetujuan' +
            (submits?.length > 0 ? ` (${submits?.length})` : '')

        const chip2 =
            (mode === 'applier' ? 'Menunggu Pencairan' : 'Perlu Dicairkan') +
            (disbursement_wait_list?.length > 0
                ? ` (${disbursement_wait_list?.length})`
                : '')

        const chip3 =
            'Angsuran Aktif' +
            (active_installments?.length > 0
                ? ` (${active_installments?.length})`
                : '')

        const chips =
            mode === 'manager'
                ? [chip1, chip2, chip3, 'Riwayat']
                : [undefined, undefined, chip3, 'Riwayat']

        return chips.map((label, index) =>
            label ? (
                <Chip
                    key={index}
                    label={label}
                    variant="outlined"
                    color={tabIndexActive === index ? 'success' : 'default'}
                    onClick={
                        tabIndexActive === index
                            ? null
                            : () => setTabIndexActive(index)
                    }
                    icon={tabIndexActive === index ? <VisibilityIcon /> : null}
                />
            ) : (
                ''
            ),
        )
    }

    return (
        <>
            <Box
                display="flex"
                gap={1}
                mb={2}
                sx={{
                    overflowX: 'auto',
                }}>
                <Chips />
            </Box>

            <TransitionGroup exit={false}>
                {tabIndexActive === 0 && (
                    <Fade>
                        <Box>
                            {(isLoading || isValidatingProduction) && (
                                <SkeletonsBox />
                            )}

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
                )}

                {tabIndexActive === 1 && (
                    <Fade>
                        <Box>
                            {(isLoading || isValidatingProduction) && (
                                <SkeletonsBox />
                            )}

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
                )}

                {tabIndexActive === 2 && (
                    <Fade>
                        <ActiveInstallmentsBox
                            data={activeInstallments}
                            isLoading={isLoading || isValidatingProduction}
                            mode={mode}
                        />
                    </Fade>
                )}

                {tabIndexActive === 3 && (
                    <Fade>
                        <Box>
                            <LoanDatatable
                                mode={mode}
                                onRowClick={dataRow =>
                                    setDraftLoan(new Loan(dataRow))
                                }
                            />
                        </Box>
                    </Fade>
                )}
            </TransitionGroup>

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
