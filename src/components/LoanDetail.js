import axios from '@/lib/axios'
import { Card, CardContent, CardHeader } from '@mui/material'
import useSWR from 'swr'

export default function LoanDetail({ loanId }) {
    if (!loanId) return <div>loading...</div>

    const {
        data: loan,
        error,
        isLoading,
    } = useSWR(`/loans/${loanId}`, () =>
        axios
            .get(`/loans/${loanId}`)
            .then(res => res.data)
            .catch(error => console.log(error)),
    )

    if (error) return <div>failed to load</div>
    if (isLoading) return <div>loading...</div>

    return (
        <Card>
            <CardHeader
                title={`#${loan.id}`}
                subheader={`${loan.created_at}
            (${loan.user.name})`}>
                {loan.id}
            </CardHeader>
            <CardContent>{loan.id}</CardContent>
        </Card>
    )
}
