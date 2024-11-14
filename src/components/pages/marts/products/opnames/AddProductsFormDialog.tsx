import { useState } from 'react'
import useSWR from 'swr'

import IconButton from '@/components/IconButton'
import TextField from '@/components/TextField'
import Product from '@/dataTypes/mart/Product'
import OpnameApiUrl from '@/enums/ApiUrl/Mart/Product/Opname'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CachedIcon from '@mui/icons-material/Cached'
import {
    Autocomplete,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    FormHelperText,
} from '@mui/material'
import axios from '@/lib/axios'
import { useRouter } from 'next/navigation'
import LaravelValidationException from '@/types/LaravelValidationException'
import { AxiosError } from 'axios'

export default function AddProductFormDialog({
    productMovementUuid,
    disabled,
}: {
    productMovementUuid: string
    disabled: boolean
}) {
    const { refresh } = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isAddByCategory, setIsAddByCategory] = useState(true)
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([])

    const [error, setError] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)

    const { data: productCategories = [], isLoading: isCategoriesLoading } =
        useSWR<string[]>(OpnameApiUrl.CATEGORIES_DATA)

    const { data: products, isLoading: isProductsLoading } = useSWR<{
        fetched_at: string
        data: Product[]
    }>(OpnameApiUrl.PRODUCTS_DATA)

    return (
        <>
            <IconButton
                title="Tambah Produk"
                icon={AddCircleIcon}
                color="success"
                disabled={disabled}
                onClick={() => setIsOpen(true)}
            />

            <Dialog fullWidth maxWidth="sm" open={isOpen}>
                <DialogTitle>Tambah Produk untuk Opname</DialogTitle>

                <DialogContent>
                    {!isAddByCategory
                        ? 'Berdasarkan ID/Nama'
                        : 'Berdasarkan Kategori'}

                    <IconButton
                        title="Ganti"
                        color="primary"
                        icon={CachedIcon}
                        onClick={() => {
                            setError(undefined)
                            setSelectedProductIds([])
                            setIsAddByCategory(prev => !prev)
                        }}
                    />

                    <Fade
                        in={isAddByCategory}
                        timeout={{
                            enter: 300,
                            exit: 0,
                        }}
                        unmountOnExit>
                        <Autocomplete
                            disabled={isCategoriesLoading || isLoading}
                            multiple
                            options={productCategories.map(
                                category => category ?? 'Tanpa Kategori',
                            )}
                            size="small"
                            onChange={(_, categories) => {
                                setError(undefined)

                                setSelectedProductIds(
                                    products?.data
                                        .filter(product =>
                                            categories
                                                .map(category =>
                                                    category ===
                                                    'Tanpa Kategori'
                                                        ? null
                                                        : category,
                                                )
                                                .includes(
                                                    product.category_name,
                                                ),
                                        )
                                        .map(product => product.id) ?? [],
                                )
                            }}
                            renderInput={params => (
                                <TextField {...params} label="Kategori" />
                            )}
                        />
                    </Fade>

                    <Fade
                        in={!isAddByCategory}
                        timeout={{
                            enter: 300,
                            exit: 0,
                        }}
                        unmountOnExit>
                        <Autocomplete
                            disabled={isProductsLoading || isLoading}
                            multiple
                            options={products?.data ?? []}
                            getOptionLabel={({ id, barcode_reg_id, name }) =>
                                `${barcode_reg_id ?? id} • ${name}`
                            }
                            size="small"
                            onChange={(_, products) => {
                                setError(undefined)
                                setSelectedProductIds(products.map(p => p.id))
                            }}
                            renderInput={params => (
                                <TextField {...params} label="Produk" />
                            )}
                        />
                    </Fade>

                    <FormHelperText error={Boolean(error)}>
                        {error
                            ? error
                            : 'Total produk yang akan ditambahkan: ' +
                              selectedProductIds.length}
                    </FormHelperText>
                </DialogContent>
                <DialogActions>
                    <Button
                        size="small"
                        onClick={() => setIsOpen(false)}
                        disabled={isLoading}>
                        Batal
                    </Button>

                    <Button
                        disabled={selectedProductIds.length === 0 || isLoading}
                        size="small"
                        color="primary"
                        onClick={() => {
                            setIsLoading(true)

                            axios
                                .post(
                                    OpnameApiUrl.ADD_PRODUCTS.replace(
                                        '$',
                                        productMovementUuid,
                                    ),
                                    {
                                        product_ids: selectedProductIds,
                                    },
                                )
                                .then(() => refresh())
                                .catch(
                                    (
                                        err: AxiosError<LaravelValidationException>,
                                    ) => {
                                        setError(err.response?.data.message)
                                        setIsLoading(false)
                                    },
                                )
                        }}>
                        Tambahkan
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
