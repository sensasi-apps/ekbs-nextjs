// vendors

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { FieldArray, useFormikContext } from 'formik'
import { useRef } from 'react'
// component
import FlexBox from '@/components/flex-box'
import NumericField from '@/components/formik-fields/numeric-field'
import RpInputAdornment from '@/components/input-adornments/rp'
import RemoveButton from '@/components/remove-button'
import SparePartFormikField from '@/modules/repair-shop/components/spare-part-formik-field'
// modules
import type SaleFormValues from '@/modules/repair-shop/types/sale-form-values'
// utils
import numberToCurrency from '@/utils/number-to-currency'

export default function SparePartsArrayField({
    name,
    isDisabled,
}: {
    name: string
    isDisabled: boolean
}) {
    const {
        values: { spare_parts, payment_method, installment_data },
    } = useFormikContext<SaleFormValues>()

    return (
        <FieldArray name={name}>
            {({ push, remove, form: { setFieldValue } }) => {
                return (
                    <>
                        <Box alignItems="center" display="flex" gap={2} mb={2}>
                            <Typography component="div" fontWeight="bold">
                                Suku Cadang
                            </Typography>

                            <AddItemButton
                                isDisabled={isDisabled}
                                push={push}
                            />
                        </Box>

                        <FlexBox flexDirection="column" gap={3}>
                            {spare_parts?.map((row, index) => (
                                <Grid
                                    alignItems="center"
                                    container
                                    display="flex"
                                    key={row.spare_part_state?.id ?? index}
                                    spacing={1}
                                    width="100%">
                                    <Grid
                                        pr={1}
                                        size={{ sm: 1, xs: 2 }}
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                        }}
                                        textAlign="right">
                                        <NumberCell
                                            index={index}
                                            isDisabled={isDisabled}
                                            remove={remove}
                                            showDelete={
                                                index === spare_parts.length - 1
                                            }
                                        />
                                    </Grid>

                                    <Grid
                                        size={{
                                            sm: 1.5,
                                            xs: 10,
                                        }}>
                                        <QtyInput
                                            isDisabled={isDisabled}
                                            name={`${name}.${index}.qty`}
                                        />
                                    </Grid>

                                    <Grid
                                        display="flex"
                                        flexDirection="column"
                                        gap={1}
                                        size={{
                                            sm: 7,
                                            xs: 12,
                                        }}>
                                        <SparePartFormikField
                                            isDisabled={isDisabled}
                                            name={`${name}.${index}.spare_part_warehouse_id`}
                                            onChange={(_, selected) => {
                                                setFieldValue(
                                                    `${name}.${index}`,
                                                    {
                                                        qty: row.qty,
                                                        rp_per_unit:
                                                            selected?.default_sell_price,
                                                        spare_part_warehouse_id:
                                                            selected?.spare_part_warehouse_id,
                                                    },
                                                )

                                                setFieldValue(
                                                    `spare_part_margins.${index}`,
                                                    {
                                                        _base_rp_per_unit:
                                                            selected?.base_rp_per_unit ??
                                                            0,
                                                        margin_percentage:
                                                            selected?.default_installment_margin_percentage ??
                                                            0,
                                                        spare_part_warehouse_id:
                                                            selected?.spare_part_warehouse_id ??
                                                            0,
                                                    } satisfies SparePartMargin,
                                                )
                                            }}
                                            state={row.spare_part_state}
                                        />

                                        <NumericField
                                            disabled={isDisabled}
                                            label="Harga satuan"
                                            name={`${name}.${index}.rp_per_unit`}
                                            numericFormatProps={{
                                                margin: 'none',
                                                slotProps: {
                                                    input: {
                                                        startAdornment: (
                                                            <RpInputAdornment />
                                                        ),
                                                    },
                                                },
                                            }}
                                        />

                                        {payment_method === 'installment' && (
                                            <FlexBox gap={2}>
                                                <NumericField
                                                    disabled={isDisabled}
                                                    label="Marjin Angsuran"
                                                    name={`spare_part_margins.${index}.margin_percentage`}
                                                    numericFormatProps={{
                                                        margin: 'none',
                                                        slotProps: {
                                                            input: {
                                                                endAdornment: (
                                                                    <InputAdornment position="end">
                                                                        %
                                                                    </InputAdornment>
                                                                ),
                                                            },
                                                        },
                                                    }}
                                                />
                                                &times;{' '}
                                                {installment_data?.n_term}{' '}
                                                {installment_data?.term_unit}
                                            </FlexBox>
                                        )}
                                    </Grid>

                                    <Grid
                                        size={{
                                            sm: 2.5,
                                            xs: 12,
                                        }}>
                                        <SubTotal index={index} />
                                    </Grid>
                                </Grid>
                            ))}
                        </FlexBox>
                    </>
                )
            }}
        </FieldArray>
    )
}

function AddItemButton({
    isDisabled,
    push,
}: {
    isDisabled: boolean
    push: (obj: object) => void
}) {
    const nRow = useRef(1)

    return (
        <Box alignItems="center" display="flex" mt={1}>
            <MuiTextField
                defaultValue={1}
                disabled={isDisabled}
                fullWidth={false}
                label="Tambah baris"
                onChange={e => (nRow.current = Number(e.target.value))}
                size="small"
                slotProps={{ input: { inputProps: { max: 99, min: 1 } } }}
                sx={{
                    maxWidth: '4em',
                }}
                type="number"
            />

            <Tooltip arrow placement="top" title="Tambah">
                <span>
                    <IconButton
                        color="success"
                        disabled={isDisabled}
                        onClick={() => {
                            for (let i = 0; i < nRow.current; i++) {
                                push({})
                            }
                        }}
                        size="small">
                        <AddCircleIcon />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}

function NumberCell({
    isDisabled,
    index,
    remove,
    showDelete,
}: {
    isDisabled: boolean
    index: number
    remove: (index: number) => void
    showDelete: boolean
}) {
    const { setFieldValue, values } = useFormikContext<SaleFormValues>()
    if (!showDelete) return index + 1

    return (
        <>
            <RemoveButton
                isDisabled={isDisabled}
                onClick={() => {
                    remove(index)

                    setFieldValue(`spare_part_margins`, [
                        ...(values.spare_part_margins?.slice(0, index) ?? []),
                        ...(values.spare_part_margins?.slice(index + 1) ?? []),
                    ])
                }}
            />

            {index + 1}
        </>
    )
}

function QtyInput({ name, isDisabled }: { name: string; isDisabled: boolean }) {
    return (
        <NumericField
            disabled={isDisabled}
            label="Jumlah"
            name={name}
            numericFormatProps={{
                margin: 'none',
            }}
        />
    )
}

function SubTotal({ index }: { index: number }) {
    const { getFieldProps } = useFormikContext<SaleFormValues>()

    const { value: row } = getFieldProps<SaleFormValues['spare_parts'][number]>(
        `spare_parts.${index}`,
    )
    const { value: payment_method } = getFieldProps('payment_method')
    const { value: spare_part_margin } = getFieldProps<
        SparePartMargin | undefined
    >(`spare_part_margins.${index}`)
    const { value: n_term = 1 } = getFieldProps<number>(
        `installment_data.n_term`,
    )

    const rpWithoutMargin = (row.qty ?? 0) * (row.rp_per_unit ?? 0)

    const baseRpPerUnit =
        spare_part_margin?._base_rp_per_unit ??
        row.spare_part_state?.warehouses[0]?.base_rp_per_unit ??
        0

    const totalInterestRp =
        payment_method === 'installment'
            ? Math.ceil(
                  (baseRpPerUnit *
                      (spare_part_margin?.margin_percentage ?? 0)) /
                      100 /
                      n_term,
              ) *
              n_term *
              n_term *
              (row.qty ?? 0)
            : 0

    const totalRp = rpWithoutMargin + totalInterestRp

    return (
        <>
            <Typography color="textDisabled" component="div" variant="caption">
                subtotal:
            </Typography>

            <Typography
                component="div"
                fontFamily="monospace"
                fontSize="1.4em"
                fontWeight="bold">
                {numberToCurrency(totalRp)}
            </Typography>
        </>
    )
}

type SparePartMargin = {
    _base_rp_per_unit: number
    margin_percentage: number
    spare_part_warehouse_id: number
}
