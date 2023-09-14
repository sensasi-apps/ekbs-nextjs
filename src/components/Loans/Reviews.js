import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'

import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'

import useAuth from '@/providers/Auth'

import LoanSummaryCard from '@/components/Loan/SummaryCard'
import Loan from '@/classes/loan'
import EmptyCard from '../Ui/EmptyCard'
import CardListSkeletons from '../Ui/CardListSkeletons'

const fetcher = url =>
    axios.get(url).then(res => res.data.map(loan => new Loan(loan)))

const LoansReviews = () => {
    const { data: currentUser } = useAuth()

    const {
        data = [],
        mutate,
        isLoading: apiLoading,
    } = useSWR('/user-loans/wait-for-review', fetcher)

    const [isLoading, setIsLoading] = useState(false)

    if (apiLoading) return <CardListSkeletons />

    if (data.length === 0)
        return <EmptyCard name="pinjaman yang perlu ditinjau" />

    const handleReject = async loan => {
        setIsLoading(true)
        await axios.post(`/user-loans/${loan.uuid}/review`, {
            is_approved: false,
        })
        await mutate()
        setIsLoading(false)
    }

    const handleApprove = async loan => {
        setIsLoading(true)
        await axios.post(`/user-loans/${loan.uuid}/review`, {
            is_approved: true,
        })
        await mutate()
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
            {!loan.hasResponsedByUser(currentUser) && (
                <CardActions
                    sx={{
                        justifyContent: 'space-evenly',
                    }}>
                    <Button
                        color="error"
                        size="large"
                        disabled={isLoading}
                        startIcon={<CloseIcon />}
                        onClick={() => handleReject(loan)}>
                        Tolak Pinjaman
                    </Button>
                    <Button
                        color="success"
                        size="large"
                        disabled={isLoading}
                        startIcon={<CheckIcon />}
                        onClick={() => handleApprove(loan)}>
                        Setujui Pinjaman
                    </Button>
                </CardActions>
            )}
        </LoanSummaryCard>
    ))
}

export default LoansReviews
