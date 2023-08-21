import PropTypes from 'prop-types'

import { mutate } from 'swr'
import { useEffect, useState } from 'react'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'

import { LoadingButton } from '@mui/lab'

import LoanInstallmentTable from './InstallmentTable'
import UserSelect from '../User/Select'
import NumericMasking from '../Inputs/NumericMasking'
import DatePicker from '../DatePicker'
import LoadingAddorment from '../LoadingAddorment'
import useFormData from '@/providers/FormData'
import useAuth from '@/providers/Auth'
import Loan from '@/classes/loan'

const fetchUserPreferences = userUuid =>
    axios
        .get(`users/${userUuid}/preferences/transaction_term_unit`)
        .then(response => response.data)

let currentUserTermUnitPreference

const LoanForm = ({ mode }) => {
    const { data: loanDraft = new Loan({}), handleClose, isNew } = useFormData()

    const { data: currentUser, userHasRole, userHasPermission } = useAuth()

    const [loanType, setLoanType] = useState(loanDraft.type || null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [isTermUnitLoading, setIsTermUnitLoading] = useState(false)
    const [isInstalmentSimulationOpen, setIsInstalmentSimulationOpen] =
        useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    useEffect(() => {
        if (mode === 'applier' && Boolean(currentUser)) {
            setIsTermUnitLoading(true)
            if (currentUserTermUnitPreference) {
                loanDraft.term_unit = currentUserTermUnitPreference
                setIsTermUnitLoading(false)
            } else {
                fetchUserPreferences(currentUser.uuid).then(res => {
                    loanDraft.term_unit = res.data
                    currentUserTermUnitPreference = res.data
                    setIsTermUnitLoading(false)
                })
            }
        }
    }, [currentUser])

    const isUserCanDelete =
        loanDraft.hasUuid &&
        userHasPermission('delete own loan') &&
        loanDraft.isCreatedByUser(currentUser) &&
        !loanDraft.hasResponses

    const handleSubmit = async event => {
        event.preventDefault()

        if (!event.target.closest('form').reportValidity()) {
            return
        }

        setIsSubmitting(true)

        try {
            if (loanDraft.hasUuid) {
                if (mode === 'manager') {
                    await axios.put(`user-loans/${loanDraft.uuid}`, loanDraft)
                } else {
                    await axios.put(`loans/${loanDraft.uuid}`, loanDraft)
                }
            } else {
                if (mode === 'manager') {
                    await axios.post('user-loans', loanDraft)
                } else {
                    await axios.post('loans', loanDraft)
                }
            }

            if (mode === 'manager') {
                await mutate('/user-loans/datatable')
            } else {
                await mutate('/loans/datatable')
            }

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsSubmitting(false)
    }

    const handleChange = e => {
        const { name, value } = e.target
        loanDraft[name] = isNaN(value) ? value : Number(value)
        clearValidationError(name)
    }

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            if (mode === 'manager') {
                await axios.delete(`/loans/${loanDraft.uuid}`)
            } else {
                await axios.delete(`/user-loans/${loanDraft.uuid}`)
            }

            if (mode === 'manager') {
                mutate('/user-loans/get-unfinished-data')
            } else {
                mutate('/loans/get-unfinished-data')
            }

            handleClose()
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsDeleting(false)
    }

    const handleEnter = e => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault()
        }
    }

    const handleUserChange = async (event, user) => {
        clearValidationError('user_uuid')

        loanDraft.user = user
        loanDraft.user_uuid = user?.uuid

        if (user) {
            setIsTermUnitLoading(true)
            loanDraft.term_unit = await fetchUserPreferences(user.uuid)
            setIsTermUnitLoading(false)
        }
    }

    const clearValidationError = name => {
        if (!validationErrors[name]) {
            return
        }

        setValidationErrors(prev => {
            prev[name] = undefined
            return prev
        })
    }

    const agreementText =
        'Dengan mengirimkan ajuan pinjaman dana ini saya telah ' +
        (mode === 'manager' ? 'memastikan' : 'menyetujui') +
        ' besar nilai angsuran per ' +
        loanDraft.term_unit +
        ', simulasi pinjaman, dan sanksi keterlambatan yang ditetapkan oleh koperasi' +
        (mode === 'manager' ? ' telah sesuai dengan permintaan pemohon' : '') +
        '. Jika terdapat kesalahan dalam pengisian data maka saya bersedia untuk bertanggung jawab.'

    return (
        <form onSubmit={handleSubmit} onKeyDown={handleEnter}>
            {!isNew && (
                <Box mb={2}>
                    <Typography variant="caption">Status:</Typography>
                    <Typography fontWeight="bold" color={loanDraft.statusColor}>
                        {loanDraft.status}
                    </Typography>
                </Box>
            )}

            {loanDraft.responses && (
                <>
                    <Typography variant="caption">
                        Telah ditinjau oleh:
                    </Typography>

                    <ul>
                        {loanDraft.responses.map((response, i) => (
                            <li key={i}>{response.by_user.name}</li>
                        ))}
                    </ul>
                </>
            )}

            {!isNew && (
                <TextField
                    disabled
                    fullWidth
                    label="uuid"
                    margin="dense"
                    size="small"
                    defaultValue={loanDraft.uuid}
                />
            )}

            <FormControl
                error={Boolean(validationErrors.type)}
                disabled={isSubmitting || isDeleting || loanDraft.hasResponses}>
                <FormLabel required>Jenis</FormLabel>
                <RadioGroup
                    row
                    name="type"
                    onChange={e => {
                        const loanType = e.target.value
                        loanDraft.type = loanType
                        setLoanType(loanType)
                        clearValidationError('type')
                    }}
                    value={loanType}>
                    <FormControlLabel
                        value="Dana Tunai"
                        required
                        control={<Radio />}
                        label="Dana Tunai"
                    />
                    <FormControlLabel
                        value="Kredit Barang"
                        control={<Radio />}
                        label="Kredit Barang"
                    />
                </RadioGroup>
                {Boolean(validationErrors.type) && (
                    <FormHelperText>{validationErrors.type}</FormHelperText>
                )}
            </FormControl>

            {mode === 'manager' && userHasRole('user loans manager') && (
                <UserSelect
                    disabled={
                        isSubmitting ||
                        isDeleting ||
                        (loanDraft.hasUuid &&
                            !loanDraft.isCreatedByUser(currentUser)) ||
                        loanDraft.hasResponses
                    }
                    required
                    label="Pemohon"
                    margin="dense"
                    onChange={handleUserChange}
                    value={loanDraft.user || null}
                    error={Boolean(validationErrors.user_uuid)}
                    helperText={validationErrors.user_uuid}
                />
            )}

            <TextField
                disabled={isSubmitting || isDeleting || loanDraft.hasResponses}
                fullWidth
                required
                margin="dense"
                name="proposed_rp"
                label="Jumlah"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">Rp</InputAdornment>
                    ),
                    inputComponent: NumericMasking,
                }}
                inputProps={{
                    decimalScale: 0,
                    minLength: 1,
                    maxLength: 19,
                }}
                onChange={handleChange}
                defaultValue={loanDraft?.proposed_rp || ''}
                error={Boolean(validationErrors.proposed_rp)}
                helperText={validationErrors.proposed_rp}
            />

            <Box display="flex" gap={1}>
                <TextField
                    disabled={
                        isSubmitting || isDeleting || loanDraft.hasResponses
                    }
                    fullWidth
                    required
                    margin="dense"
                    name="n_term"
                    label="Jangka Waktu"
                    InputProps={{
                        inputComponent: NumericMasking,
                    }}
                    inputProps={{
                        decimalScale: 0,
                        minLength: 1,
                        maxLength: 2,
                    }}
                    onChange={handleChange}
                    defaultValue={loanDraft?.n_term || ''}
                    error={Boolean(validationErrors.n_term)}
                    helperText={validationErrors.n_term}
                />

                <FormControl
                    margin="dense"
                    disabled={
                        isSubmitting ||
                        isDeleting ||
                        loanDraft.hasResponses ||
                        mode === 'applier'
                    }
                    fullWidth
                    error={Boolean(validationErrors.term_unit)}>
                    <InputLabel>Satuan Waktu Angsuran</InputLabel>
                    <Select
                        name="term_unit"
                        label="Satuan Waktu Angsuran"
                        value={
                            loanDraft.term_unit ||
                            currentUserTermUnitPreference ||
                            'bulan'
                        }
                        onChange={handleChange}
                        endAdornment={
                            <LoadingAddorment show={isTermUnitLoading} />
                        }>
                        <MenuItem value="minggu">Minggu</MenuItem>
                        <MenuItem value="bulan">Bulan</MenuItem>
                    </Select>
                    {Boolean(validationErrors.term_unit) && (
                        <FormHelperText>
                            {validationErrors.term_unit}
                        </FormHelperText>
                    )}
                </FormControl>
            </Box>

            <TextField
                disabled={
                    isSubmitting ||
                    isDeleting ||
                    (loanDraft.hasUuid &&
                        !loanDraft.isCreatedByUser(currentUser)) ||
                    loanDraft.hasResponses
                }
                rows={2}
                multiline
                fullWidth
                required
                margin="dense"
                name="purpose"
                label="Keperluan"
                onChange={handleChange}
                defaultValue={loanDraft?.purpose || ''}
                error={Boolean(validationErrors.purpose)}
                helperText={validationErrors.purpose}
            />

            <Box display="flex" gap={1}>
                <DatePicker
                    disabled={
                        mode !== 'manager' ||
                        isSubmitting ||
                        isDeleting ||
                        loanDraft.hasResponses
                    }
                    fullWidth
                    required
                    margin="dense"
                    label="Tanggal"
                    onChange={momentDate =>
                        (loanDraft.proposed_at = momentDate)
                    }
                    name="proposed_at"
                    defaultValue={loanDraft?.proposed_at}
                    error={Boolean(validationErrors.proposed_at)}
                    helperText={validationErrors.proposed_at}
                />

                <TextField
                    disabled={
                        isSubmitting ||
                        isDeleting ||
                        userHasRole('employee') ||
                        loanDraft.hasResponses
                    }
                    fullWidth
                    required
                    margin="dense"
                    label={'Persentase Jasa per ' + loanDraft.term_unit}
                    name="interest_percent"
                    defaultValue={loanDraft?.interest_percent || 1.5}
                    onChange={handleChange}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                        ),
                        inputComponent: NumericMasking,
                    }}
                    inputProps={{
                        decimalScale: 2,
                        minLength: 1,
                        maxLength: 5,
                    }}
                    error={Boolean(validationErrors.interest_percent)}
                    helperText={validationErrors.interest_percent}
                />
            </Box>

            <Box my={0.5} textAlign="end">
                <Button onClick={() => setIsInstalmentSimulationOpen(true)}>
                    Tabel {loanDraft.hasInstallments ? '' : 'Simulasi '}Angsuran
                </Button>
            </Box>

            <Typography variant="caption">{agreementText}</Typography>

            <Box
                mt={2}
                display="flex"
                justifyContent={isUserCanDelete ? 'space-between' : 'end'}>
                {isUserCanDelete && (
                    <LoadingButton
                        onClick={handleDelete}
                        variant="outlined"
                        color="error"
                        loading={isDeleting}
                        disabled={isSubmitting}
                        startIcon={<DeleteIcon />}>
                        Hapus
                    </LoadingButton>
                )}

                {!loanDraft.hasResponses && (
                    <Box>
                        <Button
                            type="reset"
                            disabled={isSubmitting || isDeleting}
                            onClick={handleClose}>
                            Batal
                        </Button>

                        <LoadingButton
                            variant="contained"
                            type="submit"
                            loading={isSubmitting}
                            disabled={isDeleting || isTermUnitLoading}>
                            {loanDraft.hasUuid ? 'Simpan' : 'Ajukan'}
                        </LoadingButton>
                    </Box>
                )}
            </Box>

            <Dialog open={isInstalmentSimulationOpen} maxWidth="md">
                <DialogTitle display="flex" justifyContent="space-between">
                    Tabel {loanDraft.hasInstallments ? '' : 'Simulasi '}Angsuran
                    <IconButton
                        size="small"
                        onClick={() => setIsInstalmentSimulationOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <LoanInstallmentTable data={loanDraft} />
                </DialogContent>
            </Dialog>
        </form>
    )
}

LoanForm.propTypes = {
    mode: PropTypes.oneOf(['applier', 'manager']).isRequired,
}

export default LoanForm
