import { useState, useEffect } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import Installment from '@/classes/Installment'

import CardListSkeletons from '../Ui/CardListSkeletons'
import EmptyCard from '../Ui/EmptyCard'
import InstallmentSummaryCard from '../Installment/SummaryCard'

const fetcher = url =>
    axios
        .get(url)
        .then(res => res.data.map(installment => new Installment(installment)))

const LoansInstallments = () => {
    const {
        data: activeInstallments = [],
        isLoading,
        isValidating,
    } = useSWR('/user-loans/active-installments', fetcher, {
        revalidateOnFocus: false,
    })

    const [filtered, setFiltered] = useState([])

    const handleChange = e => {
        const filterValue = e.target.value.toLowerCase()

        setFiltered(
            activeInstallments.filter(installment =>
                installment.loan.user.name.toLowerCase().includes(filterValue),
            ),
        )
    }

    useEffect(() => {
        if (JSON.stringify(filtered) !== JSON.stringify(activeInstallments)) {
            setFiltered(activeInstallments)
        }
    }, [activeInstallments])

    if (isLoading || isValidating) {
        return <CardListSkeletons />
    }

    if (!activeInstallments.length && !isLoading) {
        return <EmptyCard name="angsuran aktif" />
    }

    return (
        <Box>
            <TextField
                autoComplete="off"
                fullWidth
                margin="normal"
                label="Cari nama peminjam"
                name="search"
                onChange={handleChange}
            />

            <Typography mb={3} variant="body2" textAlign="end">
                Menampilkan {filtered.length} hasil dari{' '}
                {activeInstallments.length} data
            </Typography>

            {filtered.map((installment, index) => (
                <InstallmentSummaryCard
                    key={index}
                    data={installment}
                    mode="manager"
                    sx={{ mb: 2 }}
                />
            ))}
        </Box>
    )
}

export default LoansInstallments
