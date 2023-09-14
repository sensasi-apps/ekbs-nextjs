import { FC } from 'react'
import moment from 'moment'
import 'moment/locale/id'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import EditIcon from '@mui/icons-material/Edit'

import numberFormat from '@/lib/numberFormat'

import Loan from '@/classes/loan'

import CrediturCard from './CrediturCard'

const LoanSummaryCard: FC<{
    data: Loan
    mode: 'applier' | 'manager'
    isLoading?: boolean
    handleEdit?: () => void
    children?: React.ReactNode
}> = ({ data: loan, mode, isLoading, handleEdit, children, ...props }) => {
    const {
        proposed_at,
        proposed_rp,
        interest_percent,
        n_term,
        purpose,
        user,
        installmentAmount,
    } = loan

    return (
        <Card {...props}>
            <CardContent>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom>
                    {moment(proposed_at).format('DD MMMM YYYY')}{' '}
                    <Typography
                        variant="caption"
                        color="GrayText"
                        component="span">
                        {moment(proposed_at).fromNow()}
                    </Typography>
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={6} md={4}>
                        <Typography color="GrayText">Pinjaman:</Typography>
                        <Typography variant="h4" component="div">
                            {numberFormat(proposed_rp)}
                        </Typography>

                        <Typography color="GrayText">Jenis:</Typography>
                        <Typography mb={1}>{loan.type}</Typography>

                        <Typography color="GrayText">Angsuran:</Typography>
                        <Typography mb={1}>
                            {numberFormat(installmentAmount)} / {loan.term_unit}
                        </Typography>

                        <Typography color="GrayText">Keperluan:</Typography>
                        <Typography mb={1}>{purpose}</Typography>

                        <Typography color="GrayText">
                            Telah ditinjau oleh:
                        </Typography>
                        {!loan.hasResponses && <i>Belum ada peninjauan</i>}

                        {loan.hasResponses && (
                            <ul>
                                {loan?.responses?.map(response => (
                                    <li key={response.by_user_uuid}>
                                        {response.by_user.name}:{' '}
                                        {response.is_approved
                                            ? 'Menyetujui'
                                            : 'Menolak'}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Grid>

                    <Grid item xs={6} md={3}>
                        <Box display="flex" gap={2} mb={3}>
                            <Box>
                                <Typography color="GrayText">
                                    Biaya Jasa:
                                </Typography>
                                <Typography color="GrayText" component="span">
                                    Tenor:
                                </Typography>
                            </Box>

                            <Box>
                                <Typography>{interest_percent} %</Typography>
                                <Typography>
                                    {n_term} {loan.term_unit}
                                </Typography>
                            </Box>
                        </Box>

                        <Fade
                            in={Boolean(handleEdit)}
                            unmountOnExit
                            exit={false}>
                            <Button
                                variant="contained"
                                color={loan.hasResponses ? 'info' : 'warning'}
                                disabled={isLoading}
                                endIcon={
                                    loan.hasResponses ? null : <EditIcon />
                                }
                                onClick={handleEdit}>
                                {loan.hasResponses ? 'Lihat Data' : 'Ubah Data'}
                            </Button>
                        </Fade>
                    </Grid>

                    {mode === 'manager' && (
                        <Grid item xs={12} md={5}>
                            <Typography color="GrayText">Peminjam:</Typography>
                            <CrediturCard data={user} />
                        </Grid>
                    )}
                </Grid>
            </CardContent>

            {children}
        </Card>
    )
}

export default LoanSummaryCard
