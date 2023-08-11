import { useContext, useState } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import 'moment/locale/id'

import axios from '@/lib/axios'
import { mutate } from 'swr'

import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    Collapse,
    Grid,
    Typography,
} from '@mui/material'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import EditIcon from '@mui/icons-material/Edit'

import numberFormat from '@/lib/numberFormat'

import Loan from '@/classes/loan'

import UserSimplifiedViewUserBox from '../User/SimplifiedView/ButtonAndDialogForm'
import { ContactList } from '../User/Socials/CrudBox'
import SelectInputFromApi from '../SelectInputFromApi'

import AppContext from '@/providers/App'

const LoanSummaryCard = ({ data: loan, mode, handleEdit, ...props }) => {
    const {
        auth: { user: currentUser, userHasPermission },
    } = useContext(AppContext)

    const [isCollapsed, setIsCollapsed] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const {
        proposed_at,
        proposed_rp,
        interest_percent,
        n_term,
        purpose,
        user,
        installmentAmount,
    } = loan

    const handleApprove = async () => {
        setIsLoading(true)
        await axios.post(`/user-loans/${loan.uuid}/review`, {
            is_approved: true,
        })
        mutate('/user-loans/get-unfinished-data')
        setIsLoading(false)
    }

    const handleReject = async () => {
        setIsLoading(true)
        await axios.post(`/user-loans/${loan.uuid}/review`, {
            is_approved: false,
        })
        mutate('/user-loans/get-unfinished-data')
        setIsLoading(false)
    }

    const handleSubmitDisburse = async event => {
        event.preventDefault()

        setIsLoading(true)

        const formData = new FormData(event.target)

        try {
            await axios.post(`/user-loans/${loan.uuid}/disburse`, formData)
            mutate('/user-loans/get-unfinished-data')
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

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
                                <Typography color="GrayText">Bunga:</Typography>
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

                        <Button
                            variant="contained"
                            color={loan.hasResponses ? 'info' : 'warning'}
                            disabled={isLoading}
                            endIcon={loan.hasResponses ? null : <EditIcon />}
                            onClick={handleEdit}>
                            {loan.hasResponses ? 'Lihat Data' : 'Ubah Data'}
                        </Button>
                    </Grid>

                    {mode === 'manager' && (
                        <Grid item xs={12} md={5}>
                            <Typography color="GrayText">Peminjam:</Typography>
                            <Card elevation={2}>
                                <CardActionArea
                                    onClick={() =>
                                        setIsCollapsed(prev => !prev)
                                    }>
                                    <CardContent>
                                        <UserSimplifiedViewUserBox
                                            data={user}
                                        />

                                        <Collapse in={isCollapsed}>
                                            <Typography color="GrayText" mt={1}>
                                                Kontak:
                                            </Typography>
                                            <ContactList
                                                data={user?.socials}
                                                readMode
                                            />

                                            <Typography color="GrayText" mt={1}>
                                                Riwayat TBS:
                                            </Typography>
                                            <Typography>
                                                <i>Akan datang</i>
                                            </Typography>
                                        </Collapse>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    )}
                </Grid>
            </CardContent>
            {userHasPermission('response user loan') &&
                mode === 'manager' &&
                !loan.hasResponsedByUser(currentUser) && (
                    <CardActions
                        sx={{
                            justifyContent: 'space-evenly',
                        }}>
                        <Button
                            color="error"
                            size="large"
                            disabled={isLoading}
                            startIcon={<CloseIcon />}
                            onClick={handleReject}>
                            Tolak Pinjaman
                        </Button>
                        <Button
                            color="success"
                            size="large"
                            disabled={isLoading}
                            startIcon={<CheckIcon />}
                            onClick={handleApprove}>
                            Setujui Pinjaman
                        </Button>
                    </CardActions>
                )}

            {userHasPermission('disburse user loan') &&
                mode === 'manager' &&
                loan.canBeDisbursed && (
                    <Box>
                        <Typography px={2} color="GrayText">
                            Sudah dicairkan:
                        </Typography>
                        <Grid
                            container
                            p={2}
                            pt={0}
                            spacing={2}
                            component="form"
                            alignItems="center"
                            onSubmit={handleSubmitDisburse}>
                            <Grid item xs={12} md={8}>
                                <SelectInputFromApi
                                    endpoint="data/cashes"
                                    label={'Dari Kas'}
                                    name="cash_uuid"
                                    disabled={isLoading}
                                    margin="dense"
                                    required
                                    selectProps={{
                                        defaultValue:
                                            loan?.transaction?.cashable_uuid ||
                                            '',
                                    }}
                                    error={Boolean(validationErrors.cash_uuid)}
                                    helperText={validationErrors.cash_uuid}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Button
                                    color="success"
                                    variant="contained"
                                    fullWidth
                                    type="submit"
                                    disabled={isLoading}>
                                    Simpan
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                )}
        </Card>
    )
}

LoanSummaryCard.propTypes = {
    data: PropTypes.instanceOf(Loan).isRequired,
    mode: PropTypes.oneOf(['applier', 'manager']).isRequired,
    handleEdit: PropTypes.func.isRequired,
}

export default LoanSummaryCard
