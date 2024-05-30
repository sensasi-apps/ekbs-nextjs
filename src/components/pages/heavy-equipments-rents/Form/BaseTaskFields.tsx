import type FarmerGroupType from '@/dataTypes/FarmerGroup'
import type RentItemType from '@/dataTypes/RentItem'
import type { HeavyEquipmentRentFormValues } from '../Form'
// vendors
import { FastField, FormikProps } from 'formik'
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
// components
import DatePicker from '@/components/DatePicker'
import NumericFormat from '@/components/NumericFormat'
import RpInputAdornment from '@/components/InputAdornment/Rp'
import SelectFromApi from '@/components/Global/SelectFromApi'
import TextFieldFastableComponent from '@/components/TextField/FastableComponent'
import UserAutocomplete from '@/components/UserAutocomplete'
// utils
import debounce from '@/utils/debounce'
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import dayjs from 'dayjs'

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
                    row
                    aria-labelledby="rent-type"
                    name="rent-type"
                    value={type}
                    onChange={({ target: { value } }) => {
                        setFieldValue('type', value)
                        setFieldValue('payment_method', null)
                    }}>
                    <FormControlLabel
                        value="personal"
                        control={<Radio required size="small" />}
                        label="Perorangan"
                    />

                    <FormControlLabel
                        value="farmer-group"
                        control={<Radio size="small" />}
                        label="Kelompok Tani"
                    />

                    <FormControlLabel
                        value="public-service"
                        control={<Radio size="small" />}
                        label="Pelayanan Publik"
                    />
                </RadioGroup>

                {errors.type && (
                    <FormHelperText error>{errors.type}</FormHelperText>
                )}
            </FormControl>

            <Fade in={type === 'farmer-group'} unmountOnExit>
                <span>
                    <SelectFromApi
                        fullWidth
                        disabled={isDisabled}
                        endpoint="/data/farmer-groups"
                        label="Kelompok Tani"
                        required
                        size="small"
                        margin="dense"
                        selectProps={{
                            name: 'farmer_group_uuid',
                            value: farmer_group_uuid ?? '',
                            disabled: isDisabled,
                        }}
                        onValueChange={(value: FarmerGroupType) =>
                            setFieldValue('farmer_group_uuid', value.uuid)
                        }
                        {...errorsToHelperTextObj(errors.farmer_group_uuid)}
                    />
                </span>
            </Fade>

            <UserAutocomplete
                showNickname
                label={type === 'personal' ? 'Penyewa' : 'Penanggung Jawab'}
                disabled={isDisabled}
                fullWidth
                onChange={(_, user) => {
                    setFieldValue('by_user', user)
                    setFieldValue('by_user_uuid', user?.uuid)
                }}
                value={by_user ?? null}
                size="small"
                textFieldProps={{
                    required: type === 'farmer-group',
                    margin: 'dense',
                    ...errorsToHelperTextObj(errors.by_user_uuid),
                }}
            />

            <DatePicker
                value={for_at ? dayjs(for_at) : null}
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
            />

            <SelectFromApi
                fullWidth
                required
                dataKey="inventory_item_uuid"
                disabled={isDisabled}
                endpoint="/data/rentable-inventory-items"
                label="Alat Berat"
                size="small"
                margin="dense"
                selectProps={{
                    name: 'inventory_item_uuid',
                    value: inventory_item_uuid ?? '',
                }}
                renderOption={(rentItem: RentItemType) => (
                    <MenuItem
                        key={rentItem.inventory_item_uuid}
                        value={rentItem.inventory_item_uuid}>
                        {rentItem.inventory_item.code && (
                            <Chip
                                label={rentItem.inventory_item.code}
                                size="small"
                                variant="outlined"
                                sx={{
                                    mr: 1,
                                }}
                            />
                        )}

                        {rentItem.inventory_item.name}
                    </MenuItem>
                )}
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
                {...errorsToHelperTextObj(errors.inventory_item_uuid)}
            />

            <UserAutocomplete
                showNickname
                label="Operator"
                disabled={isDisabled}
                fullWidth
                onChange={(_, user) => {
                    setFieldValue('operated_by_user', user)
                    setFieldValue('operated_by_user_uuid', user?.uuid)
                }}
                value={operated_by_user ?? null}
                size="small"
                textFieldProps={{
                    required: true,
                    margin: 'dense',
                    ...errorsToHelperTextObj(errors.operated_by_user),
                }}
            />

            <Box display="inline-flex" gap={1}>
                <NumericFormat
                    label="Tarif"
                    disabled={isDisabled}
                    decimalScale={0}
                    value={rate_rp_per_unit}
                    name="rate_rp_per_unit"
                    onValueChange={({ floatValue }) =>
                        debounce(() =>
                            setFieldValue('rate_rp_per_unit', floatValue),
                        )
                    }
                    InputProps={{
                        startAdornment: <RpInputAdornment />,
                        endAdornment: (
                            <InputAdornment position="end">
                                / {rate_unit}
                            </InputAdornment>
                        ),
                    }}
                    {...errorsToHelperTextObj(
                        errors.rate_rp_per_unit || errors.rate_unit,
                    )}
                />

                <NumericFormat
                    label="Pesan Untuk"
                    disabled={isDisabled}
                    value={for_n_units}
                    name="for_n_units"
                    onValueChange={({ floatValue }) =>
                        debounce(() => setFieldValue('for_n_units', floatValue))
                    }
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                {rate_unit}
                            </InputAdornment>
                        ),
                    }}
                    {...errorsToHelperTextObj(errors.for_n_units)}
                />
            </Box>

            <FastField
                name="note"
                required={false}
                component={TextFieldFastableComponent}
                multiline
                disabled={isDisabled}
                rows={2}
                label="Catatan Tambahan"
                {...errorsToHelperTextObj(errors.note)}
            />
        </>
    )
}
