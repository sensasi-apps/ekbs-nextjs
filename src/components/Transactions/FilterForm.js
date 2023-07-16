import { useRouter } from 'next/router'

import { Grid, TextField } from '@mui/material'
import { LoadingButton } from '@mui/lab'

import DatePicker from '../DatePicker'
import SelectInputFromApi from '../SelectInputFromApi'

import dmyToYmd from '@/lib/dmyToYmd'

export default function TransactionsFilterForm({ isLoading, ...props }) {
    const router = useRouter()

    if (!router.isReady) return null

    const handleSubmit = e => {
        e.preventDefault()

        const formData = new FormData(e.target)
        const data = Object.fromEntries(formData.entries())

        if (data.at) {
            data.at = dmyToYmd(data.at)
        }

        router.push({
            query: data,
        })
    }

    return (
        <form onSubmit={handleSubmit} {...props}>
            <Grid container spacing={1} mt={1}>
                <Grid item xs={12} sm={3} md={3}>
                    <DatePicker
                        disabled={isLoading}
                        defaultValue={router.query?.at || new Date()}
                        name="at"
                        label="Pada Tanggal"
                        fullWidth
                        margin="none"
                        size="small"
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <SelectInputFromApi
                        disabled={isLoading}
                        endpoint="data/cashes"
                        label="Kas"
                        name="cash_uuid"
                        size="small"
                        margin="none"
                        nullLabel="Semua Kas"
                        selectProps={{
                            displayEmpty: true,
                            defaultValue: router.query?.cash_uuid || '',
                        }}
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={3}>
                    <TextField
                        disabled={isLoading}
                        name="query"
                        label="Kata Kunci"
                        fullWidth
                        margin="none"
                        size="small"
                        defaultValue={router.query?.query || ''}
                    />
                </Grid>

                <Grid item xs={12} sm={3} md={3}>
                    <LoadingButton
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ height: '100%' }}
                        loading={isLoading}>
                        Cari
                    </LoadingButton>
                </Grid>
            </Grid>
        </form>
    )
}
