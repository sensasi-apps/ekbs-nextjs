import { Box, Fade, IconButton, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { memo, useEffect, useState } from 'react'
import { Refresh } from '@mui/icons-material'
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
    onRefresh,
}: {
    itemTotal: number
    currentSearchPageNo: number
    productPerPage: number
    fetchedAt?: string
    onNext: () => void
    onPrev: () => void
    onRefresh: () => void
}) {
    const [cooldown, setCooldown] = useState(true)
    const maxPage = Math.ceil(itemTotal / 8)

    useEffect(() => {
        if (cooldown) {
            const timeout = setTimeout(
                () => {
                    setCooldown(false)
                },
                1000 * 5 * 60, // 5 minutes
            )

            return () => clearTimeout(timeout)
        }
    }, [cooldown])

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

            <Box display="flex" gap={1} alignItems="center">
                {fetchedAt && (
                    <Typography variant="caption">
                        terakhir disinkronkan: {dayjs(fetchedAt).fromNow()}
                    </Typography>
                )}

                <Fade in={!cooldown} unmountOnExit>
                    <IconButton
                        size="small"
                        onClick={() => {
                            onRefresh()
                            setCooldown(true)
                        }}>
                        <Refresh color="disabled" />
                    </IconButton>
                </Fade>
            </Box>
        </Box>
    )
}

export default memo(ResultNav)
