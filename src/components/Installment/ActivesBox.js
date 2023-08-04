import { useState, useMemo, useEffect, memo, forwardRef } from 'react'
import PropTypes from 'prop-types'

import {
    Box,
    Card,
    CardContent,
    Skeleton,
    TextField,
    Typography,
} from '@mui/material'

import InstallmentSummaryCard from './SummaryCard'
import Installment from '@/classes/Installment'

const ActiveInstallmentsBox = forwardRef(function ActiveInstallmentsBox(
    { data: activeInstallments, mode, isLoading, ...props },
    ref,
) {
    const [filtered, setFiltered] = useState(activeInstallments)

    const handleChange = e => {
        const filterValue = e.target.value.toLowerCase()

        const temp = activeInstallments.filter(installment =>
            installment.loan.user.name.toLowerCase().includes(filterValue),
        )

        if (JSON.stringify(temp) !== JSON.stringify(filtered)) {
            setFiltered(temp)
        }
    }

    useEffect(() => {
        if (JSON.stringify(filtered) !== JSON.stringify(activeInstallments)) {
            setFiltered(activeInstallments)
        }
    }, [activeInstallments])

    const show = useMemo(
        () =>
            filtered.map((installment, index) => (
                <InstallmentSummaryCard
                    key={index}
                    data={installment}
                    mode={mode}
                    sx={{ mb: 2 }}
                />
            )),
        [filtered],
    )

    const searchBox = useMemo(() => {
        if (mode === 'manager')
            return (
                <>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Cari nama peminjam"
                        onChange={handleChange}
                    />
                    <Typography mb={3} variant="body2" textAlign="end">
                        Menampilkan {filtered.length} hasil dari{' '}
                        {activeInstallments.length} data
                    </Typography>
                </>
            )

        return null
    }, [])

    // ############# COMPONENTS

    const EmptyCard = ({ name }) => (
        <Card>
            <CardContent
                sx={{
                    textAlign: 'center',
                }}>
                <Typography component="i">Belum ada data {name}</Typography>
            </CardContent>
        </Card>
    )

    const SkeletonsBox = () => (
        <Box
            sx={{
                '& > *': {
                    mb: 2,
                },
            }}>
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={80} />
            <Skeleton variant="rounded" height={80} />
        </Box>
    )

    if (isLoading) {
        return (
            <Box ref={ref} {...props}>
                <SkeletonsBox />
            </Box>
        )
    }

    if (!activeInstallments.length && !isLoading) {
        return (
            <Box ref={ref} {...props}>
                <EmptyCard name="angsuran aktif" />
            </Box>
        )
    }

    return (
        <Box ref={ref} {...props}>
            {searchBox}
            {show}
        </Box>
    )
})

ActiveInstallmentsBox.propTypes = {
    data: PropTypes.arrayOf(PropTypes.instanceOf(Installment)),
    mode: PropTypes.oneOf(['applier', 'manager']).isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default memo(ActiveInstallmentsBox)
