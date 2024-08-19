// vendors
import { memo } from 'react'
import {
    Box,
    BoxProps,
    Button,
    Chip,
    Divider,
    Paper,
    Typography,
} from '@mui/material'
import { Field, FieldProps } from 'formik'
import Grid2 from '@mui/material/Unstable_Grid2'
// locals
import type { FormValuesType } from '@/pages/marts/products/sales'
import DetailItem from './ReceiptPreview/DetailItem'
// components
import IconButton from '@/components/IconButton'
// icons
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import SaveIcon from '@mui/icons-material/Save'
// utils
import formatNumber from '@/utils/formatNumber'
// providers
import useAuth from '@/providers/Auth'

function ReceiptPreview() {
    const { user } = useAuth()

    return (
        <Paper
            sx={{
                p: 2.5,
            }}>
            <Box display="flex" justifyContent="end">
                <Button startIcon={<SaveIcon />} color="warning" size="small">
                    Simpan
                </Button>
            </Box>

            <Typography variant="caption" color="GrayText">
                14-08-2024 12:34:56
                {/* {dayjs().format('DD-MM-YYYY')} */}
            </Typography>

            <DefaultItemDesc desc="NO. Nota" value="" />

            <Typography variant="h4" component="div" mt={-0.5}>
                12312
            </Typography>

            <DefaultItemDesc desc="Kasir" value={user?.name ?? ''} />

            <DefaultItemDesc desc="Pelanggan" value="Mr. Y" />

            <DefaultItemDesc desc="Metode Pembayaran" value="" />

            <Box display="flex" mb={2} gap={0.75}>
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

            <Box display="flex" flexDirection="column" gap={1.5}>
                <Field
                    name="details"
                    component={({
                        field: { value },
                        form: { setFieldValue },
                    }: FieldProps<FormValuesType['details']>) => {
                        return (
                            <Grid2 container alignItems="center">
                                {value.length > 0 ? (
                                    value.map((detail, i) => (
                                        <DetailItem
                                            key={i}
                                            data={detail}
                                            onDecreaseQtyItem={() => {
                                                const detailItem = value[i]

                                                const newValue =
                                                    value[i].qty === 1
                                                        ? value.filter(
                                                              (_, idx) =>
                                                                  idx !== i,
                                                          )
                                                        : [
                                                              ...value.slice(
                                                                  0,
                                                                  i,
                                                              ),
                                                              {
                                                                  ...detailItem,
                                                                  qty:
                                                                      detailItem.qty -
                                                                      1,
                                                              },
                                                              ...value.slice(
                                                                  i + 1,
                                                              ),
                                                          ]

                                                setFieldValue(
                                                    'details',
                                                    newValue,
                                                )
                                            }}
                                        />
                                    ))
                                ) : (
                                    <Typography
                                        variant="caption"
                                        color="text.disabled"
                                        component="div"
                                        sx={{
                                            fontStyle: 'italic',
                                        }}>
                                        Belum ada barang yang ditambahkan...
                                    </Typography>
                                )}
                            </Grid2>
                        )
                    }}
                />
            </Box>

            <Divider
                sx={{
                    my: 1,
                }}
            />

            <Box>
                <Item2>Subtotal</Item2>
                <Item2>Diskon</Item2>
                <Item2>Pembulatan</Item2>
                <Item2>...</Item2>
            </Box>

            <Divider
                sx={{
                    my: 0.5,
                }}
            />

            <Grid2 container alignItems="center">
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

export default memo(ReceiptPreview)

function Item2({ children }: { children?: React.ReactNode }) {
    return (
        <Grid2 container alignItems="center">
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

function DefaultItemDesc({
    desc,
    value,
    ...props
}: BoxProps & { desc: string; value: string }) {
    return (
        <Box display="flex" gap={1} {...props}>
            <Typography
                variant="caption"
                color="GrayText"
                component="div"
                sx={{
                    ':after': {
                        content: '":"',
                    },
                }}>
                {desc}
            </Typography>
            <Typography variant="caption" component="div">
                {value}
            </Typography>
        </Box>
    )
}
