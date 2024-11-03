import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { memo } from 'react'

function ResultNav({
    itemTotal,
    currentSearchPageNo,
    productPerPage,
    onNext,
    onPrev,
}: {
    itemTotal: number
    currentSearchPageNo: number
    productPerPage: number
    onNext: () => void
    onPrev: () => void
}) {
    const maxPage = Math.ceil(itemTotal / 8)

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
                color: 'GrayText',
            }}>
            <IconButton size="small" onClick={onPrev}>
                <ArrowBackIcon color="disabled" />
            </IconButton>

            <Typography variant="overline">
                {currentSearchPageNo} / {maxPage}
            </Typography>

            <IconButton size="small" onClick={onNext}>
                <ArrowForwardIcon color="disabled" />
            </IconButton>

            <Typography variant="caption">
                Menampilkan{' '}
                {productPerPage > itemTotal ? itemTotal : productPerPage} dari{' '}
                {itemTotal} barang
            </Typography>
        </Box>
    )
}

export default memo(ResultNav)
