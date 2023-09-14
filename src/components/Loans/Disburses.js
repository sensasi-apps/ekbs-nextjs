import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import LoanSummaryCard from '@/components/Loan/SummaryCard'
import Loan from '@/classes/loan'
import EmptyCard from '../Ui/EmptyCard'
import CardListSkeletons from '../Ui/CardListSkeletons'
import SelectInputFromApi from '../SelectInputFromApi'

const fetcher = url =>
    axios.get(url).then(res => res.data.map(loan => new Loan(loan)))

const LoansDisburses = () => {
    const {
        data = [],
        mutate,
        isLoading: apiLoading,
    } = useSWR('/user-loans/wait-for-disburse', fetcher)

    const [isLoading, setIsLoading] = useState(false)
    const [validationErrors, setValidationErrors] = useState({})

    if (apiLoading) return <CardListSkeletons />

    if (data.length === 0)
        return <EmptyCard name="pinjaman yang perlu dicairkan" />

    const handleSubmitDisburse = async (event, loan) => {
        event.preventDefault()

        setIsLoading(true)

        const formData = new FormData(event.target)

        try {
            await axios.post(`/user-loans/${loan.uuid}/disburse`, formData)
            await mutate()
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors)
            } else {
                throw error
            }
        }

        setIsLoading(false)
    }

    return data.map(loan => (
        <LoanSummaryCard
            sx={{
                mb: 3,
            }}
            key={loan.uuid}
            data={loan}
            mode="manager">
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
                    onSubmit={event => handleSubmitDisburse(event, loan)}>
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
                                    loan?.transaction?.cashable_uuid || '',
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
        </LoanSummaryCard>
    ))
}

export default LoansDisburses
