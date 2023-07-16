import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'

import {
    Dialog,
    DialogContent,
    DialogTitle,
    Fab,
    IconButton,
} from '@mui/material'

import PaymentsIcon from '@mui/icons-material/Payments'

import TransactionsTable from '@/components/Transactions/Table'
import TransactionsFilterForm from '@/components/Transactions/FilterForm'
import TransactionForm from '../Transaction/Form'

import CloseIcon from '@mui/icons-material/Close'

export default function TransactionsCrud() {
    const [selectedTransaction, setSelectedTransaction] = useState(undefined)

    const router = useRouter()

    const {
        data: transactions = [],
        isLoading,
        isValidating,
        mutate,
    } = useSWR(
        'transactions',
        url =>
            axios
                .get(url, {
                    params: router.query,
                })
                .then(({ data }) => data),
        {
            revalidateOnMount: false,
            revalidateOnFocus: false,
        },
    )

    useEffect(() => {
        if (router.isReady) mutate()
    }, [router.query])

    return (
        <>
            <TransactionsFilterForm
                isLoading={isLoading || isValidating}
                style={{
                    marginBottom: '1em',
                }}
            />
            <TransactionsTable
                data={transactions}
                isLoading={isLoading || isValidating}
                handleEdit={transaction => setSelectedTransaction(transaction)}
            />

            <Dialog
                open={selectedTransaction !== undefined}
                fullWidth
                maxWidth="xs">
                <DialogTitle display="flex" justifyContent="space-between">
                    {selectedTransaction?.uuid
                        ? `Ubah Data Transaksi`
                        : 'Tambah Transaksi baru'}
                    <IconButton
                        size="small"
                        onClick={() => setSelectedTransaction(undefined)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <TransactionForm
                        data={selectedTransaction}
                        handleClose={() => setSelectedTransaction(undefined)}
                    />
                </DialogContent>
            </Dialog>

            <Fab
                disabled={selectedTransaction !== undefined}
                onClick={() => {
                    setSelectedTransaction({})
                }}
                color="success"
                aria-label="tambah transaksi"
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
