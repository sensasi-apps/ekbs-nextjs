// types

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// vendors
// ....
// materials
import Grid from '@mui/material/GridLegacy'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import type { FieldArrayRenderProps, FormikErrors } from 'formik'
import RpInputAdornment from '@/components/InputAdornment/Rp'
// components
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import type ProductMovementType from '@/modules/farm-inputs/types/orms/product-movement'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import { type FormValuesType } from '../Form'

export default function ProductMovementCostArrayField({
    replace,
    remove,
    push,
    data: costs,
    disabled,
    errors,
}: {
    data?: ProductMovementType['costs']
    disabled?: boolean
    errors?: FormikErrors<FormValuesType['costs']>
} & FieldArrayRenderProps) {
    return (
        <>
            <Typography component="div" mb={0.5} mt={2} variant="h6">
                Biaya Lain
                <Tooltip arrow placement="top" title="Tambah">
                    <span>
                        <IconButton
                            color="success"
                            disabled={disabled}
                            onClick={() => push({})}
                            size="small">
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            {(!costs || costs.length === 0) && (
                <Typography
                    color="text.secondary"
                    component="i"
                    sx={{ mb: 2 }}
                    variant="body2">
                    Tidak ada
                </Typography>
            )}

            {costs?.map((row, index) => (
                <Grid
                    alignItems="center"
                    columnSpacing={1.5}
                    container
                    key={index}
                    sx={{
                        mb: {
                            sm: 'initial',
                            xs: 1.5,
                        },
                    }}>
                    <Grid
                        alignSelf="center"
                        item
                        sm={1}
                        textAlign="center"
                        xs={2}>
                        <Tooltip arrow placement="top" title="Hapus">
                            <span>
                                <IconButton
                                    color="error"
                                    disabled={disabled}
                                    onClick={() => remove(index)}
                                    size="small">
                                    <RemoveCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>

                    <Grid item sm={3} xs={10}>
                        <TextField
                            defaultValue={row.name ?? ''}
                            disabled={disabled}
                            label="Nama"
                            name="name"
                            onChange={({ target: { value } }) => {
                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        name: value,
                                    }),
                                )
                            }}
                            required
                            {...errorsToHelperTextObj(errors?.[index]?.name)}
                        />
                    </Grid>

                    <Grid item sm={3} xs={12}>
                        <NumericFormat
                            disabled={disabled}
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            label="Total"
                            min="1"
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        rp: floatValue,
                                    }),
                                )
                            }
                            value={isNaN(row.rp) ? '' : row.rp}
                            {...errorsToHelperTextObj(errors?.[index]?.rp)}
                        />
                    </Grid>
                </Grid>
            ))}
        </>
    )
}
