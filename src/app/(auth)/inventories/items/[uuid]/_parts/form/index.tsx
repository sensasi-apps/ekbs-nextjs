// types
import type InventoryItem from '@/types/orms/inventory-item'
import type { FormikProps } from 'formik'
// vendors
import { memo, useState } from 'react'
import dayjs from 'dayjs'
import { FastField } from 'formik'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'

const InventoryItemForm = memo(function InventoryItemForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        uuid,
        // name,
        // desc,
        owned_at,
        disowned_at,
        // disowned_note,
        unfunctional_note,
        tags,

        rentable,
        default_rate_rp_per_unit,
        default_rate_unit,
    },
    setFieldValue,
}: FormikProps<InventoryItemFormValues>) {
    const isAuthHasPermission = useIsAuthHasPermission()
    const [isDisowned, setIsDisowned] = useState(!!disowned_at)
    const [isFunctional, setIsFunctional] = useState(!unfunctional_note)
    const [isRentable, setIsRentable] = useState<boolean>(
        Boolean(rentable && !rentable.deleted_at),
    )

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled =
        isPropcessing ||
        !isAuthHasPermission(['create inventory item', 'update inventory item'])

    return (
        <FormikForm
            id="inventory-items-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
                cancelButton: {
                    children: 'Batal',
                },
                loadingBar: {
                    style: {
                        transform: isNew ? undefined : 'translate(-1em, -1em)',
                    },
                },
            }}>
            {!isNew && (
                <FastField
                    name="uuid"
                    component={TextFieldFastableComponent}
                    disabled={true}
                    variant="filled"
                    label="UUID"
                    margin="normal"
                    {...errorsToHelperTextObj(errors.uuid)}
                />
            )}

            <FastField
                name="code"
                component={TextFieldFastableComponent}
                required={false}
                disabled={isDisabled}
                label="Kode"
                {...errorsToHelperTextObj(errors.code)}
            />

            <FastField
                name="name"
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Nama Inventaris"
                {...errorsToHelperTextObj(errors.name)}
            />

            <Autocomplete
                multiple
                options={[]}
                value={tags ?? []}
                disabled={isDisabled}
                freeSolo
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => {
                        const { key, ...rest } = getTagProps({ index })
                        return (
                            <Chip
                                key={key}
                                variant="filled"
                                label={option}
                                size="small"
                                {...rest}
                            />
                        )
                    })
                }
                onChange={(_, values) => setFieldValue('tags', values)}
                renderInput={params => (
                    <TextField
                        {...params}
                        required={false}
                        label="Penanda"
                        placeholder="tekan enter untuk menambahkan penanda"
                    />
                )}
            />

            <FastField
                name="desc"
                component={TextFieldFastableComponent}
                required={false}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan"
                {...errorsToHelperTextObj(errors.desc)}
            />

            <DatePicker
                value={owned_at ? dayjs(owned_at) : null}
                disabled={isDisabled}
                label="Dimiliki Sejak"
                onChange={date =>
                    setFieldValue('owned_at', date?.format('YYYY-MM-DD'))
                }
                slotProps={{
                    textField: {
                        name: 'owned_at',
                        ...errorsToHelperTextObj(errors.owned_at),
                    },
                }}
            />

            <FormControl
                margin="dense"
                fullWidth
                disabled={isDisabled}
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFunctional}
                                onChange={({ target: { checked } }) =>
                                    setIsFunctional(checked)
                                }
                                name="is_unfunctional"
                            />
                        }
                        label="Dapat digunakan"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={!isFunctional} unmountOnExit>
                <span>
                    <FastField
                        name="unfunctional_note"
                        component={TextFieldFastableComponent}
                        multiline
                        disabled={isDisabled}
                        label="Catatan Kerusakan"
                        rows={2}
                        {...errorsToHelperTextObj(errors.unfunctional_note)}
                    />
                </span>
            </Fade>

            <FormControl
                fullWidth
                margin="dense"
                disabled={!owned_at || isDisabled}
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!isDisowned}
                                onChange={({ target: { checked } }) =>
                                    setIsDisowned(!checked)
                                }
                                name="is_disowned"
                            />
                        }
                        label="Aktif"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={isDisowned} unmountOnExit>
                <span>
                    <DatePicker
                        value={disowned_at ? dayjs(disowned_at) : null}
                        disabled={isDisabled}
                        label="Tanggal Nonaktif"
                        onChange={date =>
                            setFieldValue(
                                'disowned_at',
                                date?.format('YYYY-MM-DD'),
                            )
                        }
                        slotProps={{
                            textField: {
                                name: 'disowned_at',
                                ...errorsToHelperTextObj(errors.disowned_at),
                            },
                        }}
                    />

                    <FastField
                        name="disowned_note"
                        component={TextFieldFastableComponent}
                        multiline
                        disabled={isDisabled}
                        rows={2}
                        label="Alasan Penonaktifan"
                        {...errorsToHelperTextObj(errors.disowned_note)}
                    />
                </span>
            </Fade>

            <FormControl
                fullWidth
                margin="dense"
                disabled={!owned_at || isDisabled}
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isRentable}
                                onChange={({ target: { checked } }) =>
                                    setIsRentable(checked)
                                }
                                name="is_rentalable"
                            />
                        }
                        label="Dapat disewakan"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={isRentable} unmountOnExit>
                <span>
                    <NumericFormat
                        disabled={isDisabled}
                        label="Biaya Sewa Default"
                        value={default_rate_rp_per_unit}
                        name="default_rate_rp_per_unit"
                        onValueChange={({ floatValue }) =>
                            setFieldValue(
                                'default_rate_rp_per_unit',
                                floatValue,
                            )
                        }
                        InputProps={{
                            startAdornment: <RpInputAdornment />,
                            endAdornment: (
                                <InputAdornment position="end">
                                    / {default_rate_unit}
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            minLength: 1,
                            maxLength: 19,
                        }}
                        {...errorsToHelperTextObj(
                            errors.default_rate_rp_per_unit,
                        )}
                    />
                </span>
            </Fade>
        </FormikForm>
    )
})

export default InventoryItemForm

export type InventoryItemFormValues = Partial<
    Omit<InventoryItem, 'tags'> & {
        default_rate_rp_per_unit: number
        default_rate_unit: string
        tags: string[]
    }
>
