import { Box, Button, Chip, Divider, Paper, Typography } from '@mui/material'
import formatNumber from '@/utils/formatNumber'
import Grid2 from '@mui/material/Unstable_Grid2'
import IconButton from '@/components/IconButton'
import useAuth from '@/providers/Auth'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import { Save } from '@mui/icons-material'

export default function ReceiptPreview() {
    const { user } = useAuth()

    return (
        <Paper
            sx={{
                p: 2.5,
            }}>
            <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="GrayText">
                    14-08-2024 12:34:56
                    {/* {dayjs().format('DD-MM-YYYY')} */}
                </Typography>

                <Button startIcon={<Save />} color="warning">
                    Simpan
                </Button>
            </Box>

            <DefaultItemDesc desc="NO. Nota" value=" " />

            <Typography variant="h4">12312</Typography>

            <DefaultItemDesc desc="Kasir" value={user?.name ?? ''} />

            <DefaultItemDesc desc="Pelanggan" value="Mr. Y" />

            <DefaultItemDesc desc="Metode Pembayaran" value="" />
            <Box mb={2} mt={0.5} display="flex" gap={0.7}>
                <Chip
                    label="Fisik"
                    size="small"
                    variant="outlined"
                    color="success"
                />

                <Chip
                    label="Transfer"
                    size="small"
                    variant="outlined"
                    disabled
                />
            </Box>

            <Divider />

            <Box mt={1} mb={1}>
                <Item />
                <Item />
                <Item />
                <Item />
            </Box>

            <Divider />

            <Box mt={1}>
                <Item2>Subtotal</Item2>
                <Item2>Diskon</Item2>
                <Item2>Pembulatan</Item2>
                <Item2>...</Item2>
            </Box>

            <Divider />

            <Grid2 container mb={0.75} alignItems="center" mt={1}>
                <Grid2
                    xs={7}
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em"
                    whiteSpace="nowrap"
                    textOverflow="ellipsis"
                    pl={1}>
                    Total
                </Grid2>

                <Grid2
                    xs={1}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    Rp
                </Grid2>

                <Grid2
                    xs={4}
                    textAlign="end"
                    component={Typography}
                    variant="overline"
                    lineHeight="unset"
                    fontSize="1em">
                    {formatNumber(4 * 10000)}
                </Grid2>
            </Grid2>
        </Paper>
    )
}

function Item({ children }: { children?: React.ReactNode }) {
    return (
        <Grid2 container mb={1.5} alignItems="center">
            <Grid2 xs={1}>
                <IconButton
                    title="hapus"
                    size="small"
                    icon={RemoveCircleIcon}
                    sx={{
                        p: 0,
                    }}
                    color="error"
                />
            </Grid2>
            <Grid2
                xs={7}
                component={Typography}
                variant="overline"
                lineHeight="2em"
                fontSize="1em"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                pl={1}>
                {/* {name} */}
                {children ?? (
                    <>
                        Produk A
                        <Typography variant="caption" component="div">
                            {formatNumber(1000)} pcs &times; RP{' '}
                            {formatNumber(10000)}
                        </Typography>
                    </>
                )}
            </Grid2>

            <Grid2
                xs={1}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1em">
                Rp
            </Grid2>

            <Grid2
                xs={3}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset"
                fontSize="1em">
                {formatNumber(1 * 10000)}
            </Grid2>
        </Grid2>
    )
}

function Item2({ children }: { children?: React.ReactNode }) {
    return (
        <Grid2 container mb={0.75} alignItems="center">
            <Grid2 xs={1}>
                <IconButton
                    sx={{
                        p: 0,
                    }}
                    title="hapus"
                    size="small"
                    icon={RemoveCircleIcon}
                    color="error"
                />
            </Grid2>

            <Grid2
                xs={6}
                component={Typography}
                lineHeight="unset"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
                variant="caption"
                pl={1}>
                {children}
            </Grid2>

            <Grid2
                xs={1}
                textAlign="end"
                component={Typography}
                variant="overline"
                lineHeight="unset">
                Rp
            </Grid2>

            <Grid2
                xs={4}
                textAlign="end"
                component={Typography}
                variant="caption"
                lineHeight="unset">
                {formatNumber(1 * -1 * 10000)}
            </Grid2>
        </Grid2>
    )
}

function DefaultItemDesc({ desc, value }: { desc: string; value: string }) {
    return (
        <Box display="flex">
            <Typography
                variant="caption"
                color="GrayText"
                component="div"
                mr={1}
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>
            <Typography variant="caption" component="div" mr={1}>
                {value}
            </Typography>
        </Box>
    )
}
