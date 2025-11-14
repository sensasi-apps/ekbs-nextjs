// types

// materials
import Autocomplete from '@mui/material/Autocomplete'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import InputAdornment from '@mui/material/InputAdornment'
import Switch from '@mui/material/Switch'
import dayjs from 'dayjs'
import type { FormikProps } from 'formik'
import { FastField } from 'formik'
// vendors
import { memo, useState } from 'react'
// components
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import RpInputAdornment from '@/components/input-adornments/rp'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import type InventoryItem from '@/types/orms/inventory-item'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'

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
            autoComplete="off"
            dirty={dirty}
            id="inventory-items-form"
            isNew={isNew}
            processing={isPropcessing}
            slotProps={{
                cancelButton: {
                    children: 'Batal',
                },
                loadingBar: {
                    style: {
                        transform: isNew ? undefined : 'translate(-1em, -1em)',
                    },
                },
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            {!isNew && (
                <FastField
                    component={TextFieldFastableComponent}
                    disabled={true}
                    label="UUID"
                    margin="normal"
                    name="uuid"
                    variant="filled"
                    {...errorsToHelperTextObj(errors.uuid)}
                />
            )}

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Kode"
                name="code"
                required={false}
                {...errorsToHelperTextObj(errors.code)}
            />

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Nama Inventaris"
                name="name"
                {...errorsToHelperTextObj(errors.name)}
            />

            <Autocomplete
                disabled={isDisabled}
                freeSolo
                multiple
                onChange={(_, values) => setFieldValue('tags', values)}
                options={[]}
                renderInput={params => (
                    <TextField
                        {...params}
                        label="Penanda"
                        placeholder="tekan enter untuk menambahkan penanda"
                        required={false}
                    />
                )}
                renderTags={(value: readonly string[], getTagProps) =>
                    value.map((option: string, index: number) => {
                        const { key, ...rest } = getTagProps({ index })
                        return (
                            <Chip
                                key={key}
                                label={option}
                                size="small"
                                variant="filled"
                                {...rest}
                            />
                        )
                    })
                }
                value={tags ?? []}
            />

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Catatan"
                multiline
                name="desc"
                required={false}
                rows={2}
                {...errorsToHelperTextObj(errors.desc)}
            />

            <DatePicker
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
                value={owned_at ? dayjs(owned_at) : null}
            />

            <FormControl
                disabled={isDisabled}
                fullWidth
                margin="dense"
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isFunctional}
                                name="is_unfunctional"
                                onChange={({ target: { checked } }) =>
                                    setIsFunctional(checked)
                                }
                            />
                        }
                        label="Dapat digunakan"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={!isFunctional} unmountOnExit>
                <span>
                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Catatan Kerusakan"
                        multiline
                        name="unfunctional_note"
                        rows={2}
                        {...errorsToHelperTextObj(errors.unfunctional_note)}
                    />
                </span>
            </Fade>

            <FormControl
                disabled={!owned_at || isDisabled}
                fullWidth
                margin="dense"
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={!isDisowned}
                                name="is_disowned"
                                onChange={({ target: { checked } }) =>
                                    setIsDisowned(!checked)
                                }
                            />
                        }
                        label="Aktif"
                    />
                </FormGroup>
            </FormControl>

            <Fade in={isDisowned} unmountOnExit>
                <span>
                    <DatePicker
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
                        value={disowned_at ? dayjs(disowned_at) : null}
                    />

                    <FastField
                        component={TextFieldFastableComponent}
                        disabled={isDisabled}
                        label="Alasan Penonaktifan"
                        multiline
                        name="disowned_note"
                        rows={2}
                        {...errorsToHelperTextObj(errors.disowned_note)}
                    />
                </span>
            </Fade>

            <FormControl
                disabled={!owned_at || isDisabled}
                fullWidth
                margin="dense"
                style={{
                    paddingLeft: '1em',
                }}>
                <FormGroup>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={isRentable}
                                name="is_rentalable"
                                onChange={({ target: { checked } }) =>
                                    setIsRentable(checked)
                                }
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
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    / {default_rate_unit}
                                </InputAdornment>
                            ),
                            startAdornment: <RpInputAdornment />,
                        }}
                        inputProps={{
                            maxLength: 19,
                            minLength: 1,
                        }}
                        label="Biaya Sewa Default"
                        name="default_rate_rp_per_unit"
                        onValueChange={({ floatValue }) =>
                            setFieldValue(
                                'default_rate_rp_per_unit',
                                floatValue,
                            )
                        }
                        value={default_rate_rp_per_unit}
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
