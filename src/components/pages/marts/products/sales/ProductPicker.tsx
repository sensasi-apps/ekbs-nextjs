// types
import type { FieldProps } from 'formik'
import type {
    FormikStatusType,
    FormValuesType,
} from '@/pages/marts/products/sales'
import type Product from '@/dataTypes/mart/Product'
// vendors
import { Box, Paper, Typography } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Masonry } from '@mui/lab'
import useSWR from 'swr'
// subcomponents
import CategoryChips from './ProductPicker/CategoryChips'
import ProductCard from './ProductPicker/ProductCard'
import SearchTextField from './ProductPicker/SearchTextField'
import ApiUrl from './ApiUrl'
import BarcodeReader from 'react-barcode-reader'

const WAREHOUSE = 'main'
let detailsTemp: FormValuesType['details'] = []

function ProductPicker({
    field: { name, value },
    form: { setFieldValue, status },
}: FieldProps<FormValuesType['details']>) {
    const typedStatus = status as FormikStatusType
    const { data: products = [], isLoading } = useSWR<Product[]>(
        ApiUrl.PRODUCTS,
        {
            keepPreviousData: true,
        },
    )

    useEffect(() => {
        detailsTemp = [...value]
    }, [value])

    const [query, setQuery] = useState<string>()
    const [selectedCategory, setSelectedCategory] = useState<string>()

    const debounceSetQuery = useDebouncedCallback(setQuery, 250)
    const debounceSetFieldValue = useDebouncedCallback(
        () => setFieldValue(name, [...detailsTemp]),
        100,
    )

    const filteredProducts = products?.filter(product =>
        isProductMatch(product, query, selectedCategory),
    )

    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}>
            <BarcodeReader
                onScan={
                    typedStatus?.isFormOpen
                        ? data => {
                              setQuery(data)

                              const filteredProducts = products.filter(
                                  product =>
                                      product.code
                                          ?.toLowerCase()
                                          .includes(data.toLowerCase()),
                              )

                              if (filteredProducts.length === 1) {
                                  handleAddProduct(filteredProducts[0])
                                  debounceSetFieldValue()
                              }
                          }
                        : undefined
                }
            />
            <SearchTextField
                value={query ?? ''}
                onChange={({ target: { value } }) => debounceSetQuery(value)}
            />

            <CategoryChips
                data={products}
                setSelectedCategory={setSelectedCategory}
            />

            <Box display="flex" justifyContent="center">
                {filteredProducts.length === 0 ? (
                    <Typography
                        variant="body2"
                        color="text.disabled"
                        align="center">
                        {isLoading
                            ? 'Memuat produk...'
                            : 'Tidak ada produk yang ditemukan'}
                    </Typography>
                ) : (
                    <Masonry columns={3} spacing={2}>
                        {filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                data={product}
                                onClick={() => {
                                    handleAddProduct(product)
                                    debounceSetFieldValue()
                                }}
                            />
                        ))}
                    </Masonry>
                )}
            </Box>
        </Paper>
    )
}

export default memo(ProductPicker)

function isProductMatch(
    product: Product,
    query?: string,
    selectedCategory?: string,
) {
    const isCategoryMatch =
        selectedCategory === undefined ||
        product.category_name === selectedCategory
    const isNameMatch = product.name
        .toLowerCase()
        .includes((query ?? '').toLowerCase())
    const isCodeMatch = product.code
        ?.toLowerCase()
        .includes((query ?? '').toLowerCase())
    const isIdMatch = product.id
        .toString()
        .includes((query ?? '').toLowerCase())

    return isCategoryMatch && (isNameMatch || isCodeMatch || isIdMatch)
}

function handleAddProduct(product: Product) {
    const existingIndex = detailsTemp.findIndex(
        ({ product_id }) => product_id === product.id,
    )

    if (existingIndex !== -1) {
        detailsTemp[existingIndex] = {
            ...detailsTemp[existingIndex],
            qty: detailsTemp[existingIndex].qty + 1,
        }
    } else {
        const warehouse = product.warehouses.find(
            warehouse => warehouse.warehouse === WAREHOUSE,
        )

        detailsTemp.push({
            product: product,
            product_id: product.id,
            qty: 1,
            rp_per_unit: warehouse?.default_sell_price ?? 0,
        })
    }
}
