// vendors

// icons-materials
import AddCircleIcon from '@mui/icons-material/AddCircle'
import CachedIcon from '@mui/icons-material/Cached'
// materials
import Autocomplete from '@mui/material/Autocomplete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import FormHelperText from '@mui/material/FormHelperText'
import type { AxiosError } from 'axios'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useSWR from 'swr'
import IconButton from '@/components/IconButton'
import TextField from '@/components/TextField'
import axios from '@/lib/axios'
import OpnameApiUrl from '@/modules/mart/enums/opname-api-url'
import type Product from '@/modules/mart/types/orms/product'
//
import type LaravelValidationException from '@/types/laravel-validation-exception-response'

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
                color="success"
                disabled={disabled}
                icon={AddCircleIcon}
                onClick={() => setIsOpen(true)}
                title="Tambah Produk"
            />

            <Dialog fullWidth maxWidth="sm" open={isOpen}>
                <DialogTitle>Tambah Produk untuk Opname</DialogTitle>

                <DialogContent>
                    {!isAddByCategory
                        ? 'Berdasarkan ID/Nama'
                        : 'Berdasarkan Kategori'}

                    <IconButton
                        color="primary"
                        icon={CachedIcon}
                        onClick={() => {
                            setError(undefined)
                            setSelectedProductIds([])
                            setIsAddByCategory(prev => !prev)
                        }}
                        title="Ganti"
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
                            options={productCategories.map(
                                category => category ?? 'Tanpa Kategori',
                            )}
                            renderInput={params => (
                                <TextField {...params} label="Kategori" />
                            )}
                            size="small"
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
                            getOptionLabel={({ id, barcode_reg_id, name }) =>
                                `${barcode_reg_id ?? id} • ${name}`
                            }
                            multiple
                            onChange={(_, products) => {
                                setError(undefined)
                                setSelectedProductIds(products.map(p => p.id))
                            }}
                            options={products?.data ?? []}
                            renderInput={params => (
                                <TextField {...params} label="Produk" />
                            )}
                            size="small"
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
                        disabled={isLoading}
                        onClick={() => setIsOpen(false)}
                        size="small">
                        Batal
                    </Button>

                    <Button
                        color="primary"
                        disabled={selectedProductIds.length === 0 || isLoading}
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
                        }}
                        size="small">
                        Tambahkan
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
