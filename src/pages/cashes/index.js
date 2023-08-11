import { useState } from 'react'

import Head from 'next/head'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Grid from '@mui/material/Grid'

import AuthLayout from '@/components/Layouts/AuthLayout'
import CashesSummary from '@/components/Cashes/Summary'
import CashForm from '@/components/Cash/Form'
import TransactionsCrud from '@/components/Transactions/Crud'

export default function cashses() {
    const [selectedCash, setSelectedCash] = useState(undefined)

    const handleEdit = cash => {
        setSelectedCash(cash)
    }

    const handleNew = () => {
        setSelectedCash({})
    }

    const handleClose = () => {
        setSelectedCash(undefined)
    }

    return (
        <AuthLayout title="Kas">
            <Head>
                <title>{`Kas — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Grid
                container
                spacing={3}
                sx={{
                    flexDirection: {
                        xs: 'column-reverse',
                        sm: 'column-reverse',
                        md: 'row',
                    },
                }}>
                <Grid
                    item
                    sm={12}
                    md={8}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={3}>
                    <TransactionsCrud />
                </Grid>

                <Grid item sm={12} md={4} width="100%">
                    <CashesSummary
                        handleEdit={cash => handleEdit(cash)}
                        handleNew={handleNew}
                    />
                </Grid>
            </Grid>

            <Dialog open={selectedCash !== undefined} fullWidth maxWidth="xs">
                <DialogTitle>
                    {selectedCash?.uuid
                        ? `Ubah data Kas: ${selectedCash?.name}`
                        : 'Tambah Kas baru'}
                </DialogTitle>
                <DialogContent>
                    <CashForm data={selectedCash} handleClose={handleClose} />
                </DialogContent>
            </Dialog>
        </AuthLayout>
    )
}
