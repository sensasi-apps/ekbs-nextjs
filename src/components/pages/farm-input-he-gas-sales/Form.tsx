// types

// materials
import Autocomplete from '@mui/material/Autocomplete'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import FormHelperText from '@mui/material/FormHelperText'
import Grid from '@mui/material/Grid'
import InputAdornment from '@mui/material/InputAdornment'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import type { UUID } from 'crypto'
import dayjs from 'dayjs'
import type { FormikProps } from 'formik'
import useSWR from 'swr'
// components
import DatePicker from '@/components/date-picker'
import FormikForm from '@/components/formik-form'
import NumericFormat from '@/components/numeric-format'
import TextField from '@/components/TextField'
import UserAutocomplete from '@/components/user-autocomplete'
// vendors
import axios from '@/lib/axios'
// enums
import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'
import Warehouse from '@/modules/farm-inputs/enums/warehouse'
import type Product from '@/modules/farm-inputs/types/orms/product'
import type User from '@/modules/user/types/orms/user'
import type { Ymd } from '@/types/date-string'
import type InventoryItem from '@/types/orms/inventory-item'
import type YajraDatatable from '@/types/yajra-datatable-response'
import debounce from '@/utils/debounce'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
import numberToCurrency from '@/utils/number-to-currency'

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
            autoComplete="off"
            dirty={dirty}
            id="he-gas-sale-form"
            isNew={isNew}
            processing={isPropcessing}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            {uuid && (
                <TextField
                    disabled={true}
                    label="UUID"
                    value={uuid}
                    variant="filled"
                />
            )}

            <DatePicker
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
                value={at ? dayjs(at) : null}
            />

            <UserAutocomplete
                disabled={isDisabled}
                fullWidth
                label="Pemesan"
                onChange={(_, user) => {
                    setFieldValue('buyer_user', user)
                    setFieldValue('buyer_user_uuid', user?.uuid)
                }}
                slotProps={{
                    textField: {
                        margin: 'dense',
                        required: true,
                        ...errorsToHelperTextObj(errors.buyer_user_uuid),
                    },
                }}
                value={buyer_user}
            />

            {isInvetoriesLoading ? (
                <SkeletonAutocomplete />
            ) : (
                <Autocomplete
                    disabled={isDisabled}
                    getOptionLabel={({ name, code }) =>
                        `${code ? `${code} - ` : ''}${name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                        option.uuid === value.uuid
                    }
                    onChange={(_, inventoryItem) => {
                        setFieldValue('inventory_item', inventoryItem)
                        setFieldValue(
                            'inventory_item_uuid',
                            inventoryItem?.uuid,
                        )
                    }}
                    options={inventories}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Unit Alat Berat"
                            {...errorsToHelperTextObj(
                                errors.inventory_item_uuid,
                            )}
                        />
                    )}
                    value={inventory_item ?? null}
                />
            )}

            <NumericFormat
                disabled={isDisabled}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">H.M</InputAdornment>
                    ),
                }}
                label="H.M Saat ini"
                min="1"
                onValueChange={({ floatValue }) =>
                    debounce(() => setFieldValue('current_hm', floatValue))
                }
                value={current_hm || ''}
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
                    disabled={isDisabled}
                    getOptionLabel={({ name, code }) =>
                        `${code ? `${code} - ` : ''}${name}`
                    }
                    isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                    }
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
                    options={products}
                    renderInput={params => (
                        <TextField
                            {...params}
                            {...errorsToHelperTextObj(errors.product_id)}
                            label="BBM"
                        />
                    )}
                    value={product ?? null}
                />
            )}

            <Grid container spacing={1}>
                <Grid
                    size={{
                        xs: 6,
                    }}>
                    <NumericFormat
                        disabled={isDisabled}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    /{product?.unit}
                                </InputAdornment>
                            ),
                        }}
                        label="Harga"
                        min="1"
                        onValueChange={({ floatValue }) =>
                            debounce(() =>
                                setFieldValue('rp_per_unit', floatValue),
                            )
                        }
                        value={rp_per_unit || ''}
                        {...errorsToHelperTextObj(errors.rp_per_unit)}
                    />
                </Grid>

                <Grid size={{ xs: 6 }}>
                    <NumericFormat
                        disabled={isDisabled}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {product?.unit}
                                </InputAdornment>
                            ),
                        }}
                        label="Qty"
                        min="1"
                        onValueChange={({ floatValue }) =>
                            debounce(() => setFieldValue('qty', floatValue))
                        }
                        value={qty || ''}
                        {...errorsToHelperTextObj(errors.qty)}
                    />
                </Grid>
            </Grid>

            <Typography color="gray" fontWeight="bold" mt={2}>
                TOTAL
            </Typography>
            <Typography component="div" variant="h6">
                {numberToCurrency((qty ?? 0) * (rp_per_unit ?? 0))}
            </Typography>

            <FormGroup>
                <FormControlLabel
                    checked={is_paid}
                    control={
                        <Checkbox
                            onChange={({ currentTarget }) =>
                                setFieldValue('is_paid', currentTarget.checked)
                            }
                        />
                    }
                    disabled={isDisabled}
                    label="Sudah Dibayar"
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
        height={44}
        sx={{
            mt: 1,
        }}
        variant="rounded"
    />
)

const INVENTORIES_SWR_KEY = [
    '/inventory-items/datatable',
    {
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
        search: {
            regex: false,
            value: 'alat berat',
        },
    },
]

const PRODUCTS_SWR_KEY = [
    DatatableEndpointEnum.PRODUCTS,
    {
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
        search: {
            regex: false,
            value: 'BBM',
        },
    },
]
