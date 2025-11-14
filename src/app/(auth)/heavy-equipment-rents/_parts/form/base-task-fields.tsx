// materials
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormLabel from '@mui/material/FormLabel'
import InputAdornment from '@mui/material/InputAdornment'
import MenuItem from '@mui/material/MenuItem'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import dayjs from 'dayjs'
// vendors
import { FastField, type FormikProps } from 'formik'
// components
import DatePicker from '@/components/date-picker'
import SelectFromApi from '@/components/Global/SelectFromApi'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import NumericFormat from '@/components/NumericFormat'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserAutocomplete from '@/components/user-autocomplete'
import type FarmerGroupType from '@/types/orms/farmer-group'
import type RentItemType from '@/types/orms/rent-item'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import type { HeavyEquipmentRentFormValues } from '.'

export default function BaseTaskFields({
    values: {
        inventory_item_uuid,
        type,
        by_user,
        rate_rp_per_unit,
        rate_unit,
        for_n_units,
        for_at,
        farmer_group_uuid,
        operated_by_user,
    },
    isDisabled,
    setFieldValue,
    errors,
}: {
    values: HeavyEquipmentRentFormValues
    isDisabled: boolean
    setFieldValue: FormikProps<HeavyEquipmentRentFormValues>['setFieldValue']
    errors: FormikProps<HeavyEquipmentRentFormValues>['errors']
}) {
    return (
        <>
            <FormControl disabled={isDisabled} margin="dense">
                <FormLabel id="rent-type" required>
                    Jenis
                </FormLabel>

                <RadioGroup
                    aria-labelledby="rent-type"
                    name="rent-type"
                    onChange={({ target: { value } }) => {
                        setFieldValue('type', value)
                        setFieldValue('payment_method', null)
                    }}
                    row
                    value={type ?? null}>
                    <FormControlLabel
                        control={<Radio required size="small" />}
                        label="Perorangan"
                        value="personal"
                    />

                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Kelompok Tani"
                        value="farmer-group"
                    />

                    <FormControlLabel
                        control={<Radio size="small" />}
                        label="Pelayanan Publik"
                        value="public-service"
                    />
                </RadioGroup>

                {errors.type && (
                    <FormHelperText error>{errors.type}</FormHelperText>
                )}
            </FormControl>

            <Fade in={type === 'farmer-group'} unmountOnExit>
                <span>
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/farmer-groups"
                        fullWidth
                        label="Kelompok Tani"
                        margin="dense"
                        onValueChange={(value: FarmerGroupType) =>
                            setFieldValue('farmer_group_uuid', value.uuid)
                        }
                        required
                        selectProps={{
                            disabled: isDisabled,
                            name: 'farmer_group_uuid',
                            value: farmer_group_uuid ?? '',
                        }}
                        size="small"
                        {...errorsToHelperTextObj(errors.farmer_group_uuid)}
                    />
                </span>
            </Fade>

            <UserAutocomplete
                disabled={isDisabled}
                fullWidth
                label={type === 'personal' ? 'Penyewa' : 'Penanggung Jawab'}
                onChange={(_, user) => {
                    setFieldValue('by_user', user)
                    setFieldValue('by_user_uuid', user?.uuid)
                }}
                slotProps={{
                    textField: {
                        required: type === 'farmer-group',
                        ...errorsToHelperTextObj(errors.by_user_uuid),
                    },
                }}
                value={by_user ?? null}
            />

            <DatePicker
                disabled={isDisabled}
                label="Untuk Tanggal"
                onChange={date =>
                    setFieldValue('for_at', date?.format('YYYY-MM-DD'))
                }
                slotProps={{
                    textField: {
                        ...errorsToHelperTextObj(errors.for_at),
                    },
                }}
                value={for_at ? dayjs(for_at) : null}
            />

            <SelectFromApi
                dataKey="inventory_item_uuid"
                disabled={isDisabled}
                endpoint="/data/rentable-inventory-items"
                fullWidth
                label="Alat Berat"
                margin="dense"
                onValueChange={(rentItem: RentItemType) => {
                    setFieldValue(
                        'inventory_item_uuid',
                        rentItem.inventory_item_uuid,
                    )
                    setFieldValue(
                        'rate_rp_per_unit',
                        rentItem.default_rate_rp_per_unit,
                    )
                    setFieldValue('rate_unit', rentItem.default_rate_unit)
                }}
                renderOption={(rentItem: RentItemType) => (
                    <MenuItem
                        key={rentItem.inventory_item_uuid}
                        value={rentItem.inventory_item_uuid}>
                        {rentItem.inventory_item.code && (
                            <Chip
                                label={rentItem.inventory_item.code}
                                size="small"
                                sx={{
                                    mr: 1,
                                }}
                                variant="outlined"
                            />
                        )}

                        {rentItem.inventory_item.name}
                    </MenuItem>
                )}
                required
                selectProps={{
                    name: 'inventory_item_uuid',
                    value: inventory_item_uuid ?? '',
                }}
                size="small"
                {...errorsToHelperTextObj(errors.inventory_item_uuid)}
            />

            <UserAutocomplete
                disabled={isDisabled}
                fullWidth
                label="Operator"
                onChange={(_, user) => {
                    setFieldValue('operated_by_user', user)
                    setFieldValue('operated_by_user_uuid', user?.uuid)
                }}
                slotProps={{
                    textField: {
                        ...errorsToHelperTextObj(errors.operated_by_user),
                    },
                }}
                value={operated_by_user ?? null}
            />

            <Box display="inline-flex" gap={1}>
                <NumericFormat
                    decimalScale={0}
                    disabled={isDisabled}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                / {rate_unit}
                            </InputAdornment>
                        ),
                        startAdornment: <RpInputAdornment />,
                    }}
                    label="Tarif"
                    name="rate_rp_per_unit"
                    onValueChange={({ floatValue }) =>
                        debounce(() =>
                            setFieldValue('rate_rp_per_unit', floatValue),
                        )
                    }
                    value={rate_rp_per_unit}
                    {...errorsToHelperTextObj(
                        errors.rate_rp_per_unit || errors.rate_unit,
                    )}
                />

                <NumericFormat
                    disabled={isDisabled}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {rate_unit}
                            </InputAdornment>
                        ),
                    }}
                    label="Pesan Untuk"
                    name="for_n_units"
                    onValueChange={({ floatValue }) =>
                        debounce(() => setFieldValue('for_n_units', floatValue))
                    }
                    value={for_n_units}
                    {...errorsToHelperTextObj(errors.for_n_units)}
                />
            </Box>

            <FastField
                component={TextFieldFastableComponent}
                disabled={isDisabled}
                label="Catatan Tambahan"
                multiline
                name="note"
                required={false}
                rows={2}
                {...errorsToHelperTextObj(errors.note)}
            />
        </>
    )
}
