import AppLayout from '@/components/Layouts/AppLayout'
import { useState } from 'react'

import {
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
} from '@mui/material'
import Head from 'next/head'
import LoanSummary from '@/components/Loan/Summary'

const Loans = () => {
    // const [searchBy, setSearchBy] = useState('date')
    // const [searchDate, setSearchDate] = useState('')
    // const [searchUserId, setSearchUserId] = useState('')
    const [searchLoanId, setSearchLoanId] = useState('')

    // const [Loan, setLoan] = useState({})

    function findLoan(e) {
        e.preventDefault()

        console.log(`loans/${searchLoanId}`)

        const formData = new FormData(e.target)

        setSearchLoanId(formData.get('loan_id'))

        console.log(formData.get('loan_id'))
    }

    return (
        <AppLayout header={'Loans'}>
            <Head>
                <title>Loans</title>
            </Head>

            <form onSubmit={findLoan}>
                <FormControl>
                    <FormLabel>Cari Berdasarkan:</FormLabel>
                    <RadioGroup row>
                        <FormControlLabel
                            value="date"
                            control={<Radio />}
                            label="Tanggal"
                            checked
                        />
                        <FormControlLabel
                            value="user_id"
                            control={<Radio />}
                            label="Pengguna"
                        />
                        <FormControlLabel
                            value="loan_id"
                            control={<Radio />}
                            Flabel="Nomor"
                        />
                    </RadioGroup>
                </FormControl>
                <TextField label="Tanggal" fullWidth type="date" />
                <TextField
                    label="Nomor Pinjaman"
                    fullWidth
                    name="loan_id"
                    type="number"
                />

                <Button type="submit">Cari</Button>
            </form>

            <LoanSummary loanId={searchLoanId} />
        </AppLayout>
    )
}

export default Loans
