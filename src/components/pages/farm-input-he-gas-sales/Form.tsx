// types
import type { FormikProps } from 'formik'
import type Product from '@/dataTypes/Product'
import type { Ymd } from '@/types/DateString'
import type YajraDatatable from '@/types/yajra-datatable-response'
import type InventoryItem from '@/dataTypes/InventoryItem'
import type { UUID } from 'crypto'
import type User from '@/features/user/types/user'
// vendors
import axios from '@/lib/axios'
import dayjs from 'dayjs'
import useSWR from 'swr'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
// components
import DatePicker from '@/components/DatePicker'
import FormikForm from '@/components/formik-form'
import NumericFormat from '@/components/NumericFormat'
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/UserAutocomplete'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import debounce from '@/utils/debounce'
import numberToCurrency from '@/utils/number-to-currency'
// enums
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'
import Warehouse from '@/enums/Warehouse'

export type FormValues = Partial<{
    is_paid: boolean
    at: Ymd
    product_id: number
    buyer_user_uuid: UUID
    inventory_item_uuid: UUID
    qty: number
    current_hm: number
    rp_per_unit: number

    // helpers
    uuid: UUID
    has_tx: boolean
    inventory_item: InventoryItem | null
    product: Product | null
    buyer_user: User | null
}>

export default function FarmInputHeGasSaleForm({
    dirty,
    errors,
    isSubmitting,
    values: {
        uuid,
        at,
        qty,
        current_hm,
        rp_per_unit,
        product,
        inventory_item,
        buyer_user,
        is_paid,
        has_tx,
    },
    setFieldValue,
}: FormikProps<FormValues>) {
    const { data: products = [], isLoading: isProductsLoading } = useSWR(
        PRODUCTS_SWR_KEY,
        FETCHER<Product>,
        {
            revalidateOnMount: true,
        },
    )

    const { data: inventories = [], isLoading: isInvetoriesLoading } = useSWR(
        INVENTORIES_SWR_KEY,
        FETCHER<InventoryItem>,
        {},
    )

    const isNew = !uuid
    const isPropcessing = isSubmitting
    const isDisabled = Boolean(
        isPropcessing || isProductsLoading || isInvetoriesLoading || has_tx,
    )

    return (
        <FormikForm
            id="he-gas-sale-form"
            autoComplete="off"
            isNew={isNew}
            dirty={dirty}
            processing={isPropcessing}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            {uuid && (
                <TextField
                    disabled={true}
                    label="UUID"
                    value={uuid}
                    variant="filled"
                />
            )}

            <DatePicker
                value={at ? dayjs(at) : null}
                disabled={isDisabled}
                disableFuture
                label="Tanggal"
                onChange={date =>
                    setFieldValue('at', date?.format('YYYY-MM-DD'))
                }
                slotProps={{
                    textField: {
                        name: 'at',
                        ...errorsToHelperTextObj(errors.at),
                    },
                }}
            />

            <UserAutocomplete
                label="Pemesan"
                showNickname
                disabled={isDisabled}
                fullWidth
                onChange={(_, user) => {
                    setFieldValue('buyer_user', user)
                    setFieldValue('buyer_user_uuid', user?.uuid)
                }}
                value={buyer_user}
                size="small"
                textFieldProps={{
                    margin: 'dense',
                    required: true,
                    ...errorsToHelperTextObj(errors.buyer_user_uuid),
                }}
            />

            {isInvetoriesLoading ? (
                <SkeletonAutocomplete />
            ) : (
                <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                        option.uuid === value.uuid
                    }
                    options={inventories}
                    disabled={isDisabled}
                    getOptionLabel={({ name, code }) =>
                        `${code ? `${code} - ` : ''}${name}`
                    }
                    value={inventory_item ?? null}
                    onChange={(_, inventoryItem) => {
                        setFieldValue('inventory_item', inventoryItem)
                        setFieldValue(
                            'inventory_item_uuid',
                            inventoryItem?.uuid,
                        )
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Unit Alat Berat"
                            {...errorsToHelperTextObj(
                                errors.inventory_item_uuid,
                            )}
                        />
                    )}
                />
            )}

            <NumericFormat
                min="1"
                disabled={isDisabled}
                label="H.M Saat ini"
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">H.M</InputAdornment>
                    ),
                }}
                value={current_hm || ''}
                onValueChange={({ floatValue }) =>
                    debounce(() => setFieldValue('current_hm', floatValue))
                }
                {...errorsToHelperTextObj(errors.current_hm)}
            />

            <div
                style={{
                    marginTop: 16,
                }}
            />

            {isProductsLoading ? (
                <SkeletonAutocomplete />
            ) : (
                <Autocomplete
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
                    options={products}
                    disabled={isDisabled}
                    getOptionLabel={({ name, code }) =>
                        `${code ? `${code} - ` : ''}${name}`
                    }
                    value={product ?? null}
                    onChange={(_, product) => {
                        setFieldValue('product', product)
                        setFieldValue('product_id', product?.id)
                        setFieldValue(
                            'rp_per_unit',
                            product?.warehouses.find(
                                w => w.warehouse === Warehouse.MUAI,
                            )?.default_sell_price,
                        )
                    }}
                    renderInput={params => (
                        <TextField
                            {...params}
                            {...errorsToHelperTextObj(errors.product_id)}
                            label="BBM"
                        />
                    )}
                />
            )}

            <Grid container spacing={1}>
                <Grid
                    size={{
                        xs: 6,
                    }}>
                    <NumericFormat
                        min="1"
                        disabled={isDisabled}
                        label="Harga"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    /{product?.unit}
                                </InputAdornment>
                            ),
                        }}
                        value={rp_per_unit || ''}
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                setFieldValue('rp_per_unit', floatValue),
                            )
                        }
                        {...errorsToHelperTextObj(errors.rp_per_unit)}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <NumericFormat
                        min="1"
                        disabled={isDisabled}
                        label="Qty"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {product?.unit}
                                </InputAdornment>
                            ),
                        }}
                        value={qty || ''}
                        onValueChange={({ floatValue }) =>
                            debounce(() => setFieldValue('qty', floatValue))
                        }
                        {...errorsToHelperTextObj(errors.qty)}
                    />
                </Grid>
            </Grid>

            <Typography mt={2} color="gray" fontWeight="bold">
                TOTAL
            </Typography>
            <Typography variant="h6" component="div">
                {numberToCurrency((qty ?? 0) * (rp_per_unit ?? 0))}
            </Typography>

            <FormGroup>
                <FormControlLabel
                    label="Sudah Dibayar"
                    disabled={isDisabled}
                    checked={is_paid}
                    control={
                        <Checkbox
                            onChange={({ currentTarget }) =>
                                setFieldValue('is_paid', currentTarget.checked)
                            }
                        />
                    }
                />

                {errors.is_paid && (
                    <FormHelperText error>{errors.is_paid}</FormHelperText>
                )}
            </FormGroup>
        </FormikForm>
    )
}

async function FETCHER<T>([url, params]: [
    string,
    {
        search: {
            value: string
            regex: boolean
        }
    },
]) {
    return axios
        .get<YajraDatatable<T>>(url, {
            params,
        })
        .then(res => res.data.data)
}

const SkeletonAutocomplete = () => (
    <Skeleton
        variant="rounded"
        height={44}
        sx={{
            mt: 1,
        }}
    />
)

const INVENTORIES_SWR_KEY = [
    '/inventory-items/datatable',
    {
        search: {
            value: 'alat berat',
            regex: false,
        },
        columns: [
            {
                name: 'name',
            },
            {
                name: 'code',
            },
            {
                name: 'tags.name',
            },
        ],
    },
]

const PRODUCTS_SWR_KEY = [
    DatatableEndpointEnum.PRODUCTS,
    {
        search: {
            value: 'BBM',
            regex: false,
        },
        columns: [
            {
                name: 'name',
            },
            {
                name: 'code',
            },
            {
                name: 'category_name',
            },
        ],
    },
]
