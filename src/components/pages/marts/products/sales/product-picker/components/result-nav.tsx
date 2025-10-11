// vendors

// icons-materials
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
// materials
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import dayjs, { extend } from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { memo, useEffect, useState } from 'react'

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
            alignItems="center"
            display="flex"
            justifyContent="space-between"
            sx={{
                color: 'GrayText',
            }}>
            <Box alignItems="center" display="flex" gap={1}>
                <IconButton onClick={onPrev} size="small">
                    <ArrowBackIcon color="disabled" />
                </IconButton>

                <Typography variant="overline">
                    {Math.min(currentSearchPageNo, maxPage)} / {maxPage}
                </Typography>

                <IconButton onClick={onNext} size="small">
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
