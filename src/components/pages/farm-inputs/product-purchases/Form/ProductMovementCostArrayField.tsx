// types
import type ProductMovementType from '@/dataTypes/ProductMovement'
import type { FieldArrayRenderProps, FormikErrors } from 'formik'
// vendors
// ....
// materials
import Grid from '@mui/material/GridLegacy'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
// components
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
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
            <Typography variant="h6" component="div" mt={2} mb={0.5}>
                Biaya Lain
                <Tooltip placement="top" arrow title="Tambah">
                    <span>
                        <IconButton
                            disabled={disabled}
                            color="success"
                            size="small"
                            onClick={() => push({})}>
                            <AddCircleIcon />
                        </IconButton>
                    </span>
                </Tooltip>
            </Typography>

            {(!costs || costs.length === 0) && (
                <Typography
                    variant="body2"
                    component="i"
                    color="text.secondary"
                    sx={{ mb: 2 }}>
                    Tidak ada
                </Typography>
            )}

            {costs?.map((row, index) => (
                <Grid
                    key={index}
                    container
                    columnSpacing={1.5}
                    alignItems="center"
                    sx={{
                        mb: {
                            xs: 1.5,
                            sm: 'initial',
                        },
                    }}>
                    <Grid
                        item
                        xs={2}
                        sm={1}
                        alignSelf="center"
                        textAlign="center">
                        <Tooltip placement="top" arrow title="Hapus">
                            <span>
                                <IconButton
                                    disabled={disabled}
                                    color="error"
                                    size="small"
                                    onClick={() => remove(index)}>
                                    <RemoveCircleIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Grid>

                    <Grid item xs={10} sm={3}>
                        <TextField
                            required
                            disabled={disabled}
                            label="Nama"
                            name="name"
                            defaultValue={row.name ?? ''}
                            onChange={({ target: { value } }) => {
                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        name: value,
                                    }),
                                )
                            }}
                            {...errorsToHelperTextObj(errors?.[index]?.name)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={3}>
                        <NumericFormat
                            min="1"
                            disabled={disabled}
                            label="Total"
                            InputProps={{
                                startAdornment: <RpInputAdornment />,
                            }}
                            value={isNaN(row.rp) ? '' : row.rp}
                            onValueChange={({ floatValue }) =>
                                debounce(() =>
                                    replace(index, {
                                        ...row,
                                        rp: floatValue,
                                    }),
                                )
                            }
                            {...errorsToHelperTextObj(errors?.[index]?.rp)}
                        />
                    </Grid>
                </Grid>
            ))}
        </>
    )
}
