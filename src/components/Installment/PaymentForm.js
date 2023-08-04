import PropTypes from 'prop-types'

import { useState } from 'react'
import { mutate } from 'swr'
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material'

import axios from '@/lib/axios'
import Installment from '@/classes/Installment'
import numberFormat from '@/lib/numberFormat'
import SelectInputFromApi from '../SelectInputFromApi'

import { LoadingButton } from '@mui/lab'

const InstallmentPaymentForm = ({ data: installment }) => {
    const [paymentMethod, setPaymentMethod] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()
        setIsLoading(true)
        const formData = new FormData(e.target)

        try {
            await axios.post(
                `/user-loans/${installment.uuid}/collect-installment`,
                formData,
            )
        } catch (error) {
            if (error.response.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        mutate('/user-loans/get-unfinished-data')
        setIsLoading(false)
    }
    return (
        <Grid
            container
            p={2}
            pt={0}
            spacing={2}
            component="form"
            alignItems="center"
            onSubmit={handleSubmit}>
            <Grid item xs={12} md={4}>
                <FormControl fullWidth disabled={isLoading}>
                    <InputLabel>Dari</InputLabel>
                    <Select
                        name="method"
                        label="Dari"
                        defaultValue=""
                        onChange={e => setPaymentMethod(e.target.value)}>
                        <MenuItem value="cash">Tunai</MenuItem>
                        <MenuItem value="ekbs_wallet">
                            Wallet e-KBS (saldo:
                            {numberFormat(installment.loan.user.cash.balance)})
                        </MenuItem>
                    </Select>
                </FormControl>
            </Grid>

            {paymentMethod === 'cash' && (
                <Grid item xs={12} md={4}>
                    <SelectInputFromApi
                        endpoint="data/cashes"
                        label={'Ke Kas'}
                        name="cash_uuid"
                        disabled={isLoading}
                        margin="dense"
                        required
                        selectProps={{
                            defaultValue:
                                installment?.transaction?.cashable_uuid || '',
                        }}
                        error={Boolean(validationErrors.cash_uuid)}
                        helperText={validationErrors.cash_uuid}
                    />
                </Grid>
            )}

            <Grid item xs={12} md={4}>
                <LoadingButton
                    color="success"
                    variant="contained"
                    fullWidth
                    type="submit"
                    disabled={isLoading}>
                    Simpan
                </LoadingButton>
            </Grid>
        </Grid>
    )
}

InstallmentPaymentForm.propTypes = {
    data: PropTypes.instanceOf(Installment).isRequired,
}

export default InstallmentPaymentForm
