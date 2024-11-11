import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { memo, useEffect, useState } from 'react'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

extend(relativeTime)

function ResultNav({
    itemTotal,
    currentSearchPageNo,
    productPerPage,
    fetchedAt,
    onNext,
    onPrev,
}: {
    itemTotal: number
    currentSearchPageNo: number
    productPerPage: number
    fetchedAt?: string
    onNext: () => void
    onPrev: () => void
}) {
    const maxPage = Math.ceil(itemTotal / 8)

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{
                color: 'GrayText',
            }}>
            <Box display="flex" alignItems="center" gap={1}>
                <IconButton size="small" onClick={onPrev}>
                    <ArrowBackIcon color="disabled" />
                </IconButton>

                <Typography variant="overline">
                    {Math.min(currentSearchPageNo, maxPage)} / {maxPage}
                </Typography>

                <IconButton size="small" onClick={onNext}>
                    <ArrowForwardIcon color="disabled" />
                </IconButton>

                <Typography variant="caption">
                    Menampilkan {Math.min(itemTotal, productPerPage)} dari{' '}
                    {itemTotal} barang
                </Typography>
            </Box>

            {fetchedAt && <FetchedAtInfo fetchedAt={fetchedAt} />}
        </Box>
    )
}

export default memo(ResultNav)

function FetchedAtInfo({ fetchedAt }: { fetchedAt: string }) {
    const [fetchedAtDiff, setFetchedAtDiff] = useState<string>(
        dayjs(fetchedAt).fromNow(),
    )

    useEffect(() => {
        setFetchedAtDiff(dayjs(fetchedAt).fromNow())

        const interval = setInterval(() => {
            setFetchedAtDiff(dayjs(fetchedAt).fromNow())
        }, 1000 * 60) // 1 minute

        return () => clearInterval(interval)
    }, [fetchedAt])

    return (
        <Typography variant="caption">
            terakhir disinkronkan: {fetchedAtDiff}
        </Typography>
    )
}
