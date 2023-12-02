// types
import type InventoryItem from '@/dataTypes/InventoryItem'
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
import Switch from '@mui/material/Switch'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/FormikForm'
import TextField from '@/components/TextField'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
// providers
import useAuth from '@/providers/Auth'

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
    },
    setFieldValue,
}: FormikProps<typeof EMPTY_FORM_DATA>) {
    const { userHasPermission } = useAuth()
    const [isDisowned, setIsDisowned] = useState(!!disowned_at)
    const [isFunctional, setIsFunctional] = useState(!unfunctional_note)

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled =
        isPropcessing ||
        !userHasPermission(['inventory item create', 'inventory item update'])

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
                name="name"
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Nama Inventaris"
                {...errorsToHelperTextObj(errors.name)}
            />

            <Autocomplete
                multiple
                id="tags-filled"
                options={[]}
                value={tags?.map(tag => tag.name ?? tag) ?? []}
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
        </FormikForm>
    )
})

export default InventoryItemForm

export const EMPTY_FORM_DATA: Partial<InventoryItem> = {}
