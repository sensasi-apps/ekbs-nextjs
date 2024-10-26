// types
import type { FieldProps } from 'formik'
import type Product from '@/dataTypes/mart/Product'
import type { FormikStatusType, FormValuesType } from './formik-component'
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
import ApiUrl from './@enums/api-url'
import BarcodeReader from 'react-barcode-reader'
import ScrollableXBox from '@/components/ScrollableXBox'
import ResultNav from './ProductPicker/ResultNav'

const WAREHOUSE = 'main'
let detailsTemp: FormValuesType['details'] = []
const PRODUCT_PER_PAGE = 8

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

    const [currentSearchPageNo, setCurrentSearchPageNo] = useState(1)

    useEffect(() => {
        detailsTemp = [...value]
    }, [value])

    const [query, setQuery] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>()

    const debounceSetQuery = useDebouncedCallback(setQuery, 250)
    const debounceSetFieldValue = useDebouncedCallback(
        () => setFieldValue(name, [...detailsTemp]),
        100,
    )

    const filteredProducts = []

    const itemTotal = products.reduce(
        (acc, product) =>
            acc + (isProductMatch(product, query, selectedCategory) ? 1 : 0),
        0,
    )

    let skipCount = 0

    for (const product of products) {
        if (filteredProducts.length >= PRODUCT_PER_PAGE) break

        if (isProductMatch(product, query, selectedCategory)) {
            if (
                skipCount <
                currentSearchPageNo * PRODUCT_PER_PAGE - PRODUCT_PER_PAGE
            ) {
                skipCount++
                continue
            }

            filteredProducts.push(product)
        }
    }

    const maxPage = Math.ceil(itemTotal / PRODUCT_PER_PAGE)

    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}>
            <BarcodeReader
                onScan={data => {
                    setQuery(data)

                    if (typedStatus?.isFormOpen) {
                        const filteredProducts = products.filter(product =>
                            product.code
                                ?.toLowerCase()
                                .includes(data.toLowerCase()),
                        )

                        if (filteredProducts.length === 1) {
                            handleAddProduct(filteredProducts[0])
                            debounceSetFieldValue()
                        }
                    }
                }}
            />
            <SearchTextField
                value={query ?? ''}
                onChange={({ target: { value } }) => debounceSetQuery(value)}
            />

            <CategoryChips
                data={products}
                onSelect={category => {
                    setSelectedCategory(category)
                    setCurrentSearchPageNo(1)
                }}
            />

            <ResultNav
                currentSearchPageNo={currentSearchPageNo}
                itemTotal={itemTotal}
                productPerPage={PRODUCT_PER_PAGE}
                onPrev={() =>
                    setCurrentSearchPageNo(prev =>
                        prev - 1 === 0 ? maxPage : prev - 1,
                    )
                }
                onNext={() =>
                    setCurrentSearchPageNo(prev =>
                        prev + 1 > maxPage ? 1 : prev + 1,
                    )
                }
            />

            <Box display="flex" justifyContent="center">
                {isLoading ? (
                    <Typography
                        variant="body2"
                        color="text.disabled"
                        align="center">
                        Memuat produk...
                    </Typography>
                ) : (
                    <>
                        <Masonry
                            sx={{
                                display: { xs: 'none', sm: 'flex' },
                            }}
                            columns={4}
                            spacing={2}>
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

                        <ScrollableXBox
                            sx={{
                                display: { xs: 'flex', sm: 'none' },
                                '& > .MuiPaper-root': {
                                    width: 200,
                                    minWidth: 200,
                                    whiteSpace: 'wrap',
                                },
                            }}>
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
                        </ScrollableXBox>
                    </>
                )}
            </Box>
        </Paper>
    )
}

export default memo(ProductPicker)

function isProductMatch(
    product: Product,
    query: string,
    selectedCategory?: string,
) {
    const isCategoryMatch =
        selectedCategory === undefined ||
        product.category_name === selectedCategory
    const isNameMatch = product.name.toLowerCase().includes(query.toLowerCase())
    const isCodeMatch = product.code
        ?.toLowerCase()
        .includes(query.toLowerCase())
    const isIdMatch = product.id.toString().includes(query.toLowerCase())

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
