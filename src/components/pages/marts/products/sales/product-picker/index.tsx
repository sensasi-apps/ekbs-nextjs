// types
import type { FieldProps } from 'formik'
import type Product from '@/dataTypes/mart/Product'
import type { FormikStatusType, FormValuesType } from '../formik-wrapper'
import type { FormattedEntry } from '@/sw/functions/handle-message'
import type { SubmittedData } from '../formik-wrapper/@types/submitted-data'
// vendors
import { Box, Paper, Typography } from '@mui/material'
import { memo, useEffect, useState } from 'react'
import { useDebouncedCallback } from 'use-debounce'
import { Masonry } from '@mui/lab'
import useSWR from 'swr'
// subcomponents
import CategoryChips from './components/category-chips'
import ProductCard from './components/product-card'
import SearchTextField from './components/search-text-field'
import ApiUrl from '../@enums/api-url'
import BarcodeReader from 'react-barcode-reader'
import ScrollableXBox from '@/components/ScrollableXBox'
import ResultNav from './components/result-nav'
import { postToSw } from '@/functions/post-to-sw'

let detailsTemp: FormValuesType['details'] = []
let entries: FormattedEntry<SubmittedData>[] = []

const WAREHOUSE = 'main'
const PRODUCT_PER_PAGE = 8

type ApiResponseType = {
    fetched_at: string
    data: (Product & {
        is_in_opname: boolean
    })[]
}

function ProductPicker({
    field: { name, value },
    form: { setFieldValue, status },
}: FieldProps<FormValuesType['details']>) {
    const typedStatus = status as FormikStatusType
    const {
        data: products,
        isLoading,
        mutate,
    } = useSWR<ApiResponseType>(ApiUrl.PRODUCTS, null, {
        revalidateOnReconnect: true,
        refreshInterval: 15 * 60 * 1000, // 15 minutes
    })

    const [currentSearchPageNo, setCurrentSearchPageNo] = useState(1)

    useEffect(() => {
        detailsTemp = [...value]
    }, [value])

    const [query, setQuery] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<
        string | undefined
    >()

    const debounceSetQuery = useDebouncedCallback(setQuery, 250)
    const debounceSetFieldValue = useDebouncedCallback(
        () => setFieldValue(name, [...detailsTemp]),
        100,
    )

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            function updateEntries() {
                postToSw('GET_SALES').then(data => (entries = data))
            }

            addEventListener('mart-sale-queued', updateEntries)

            updateEntries()

            return () => removeEventListener('mart-sale-queued', updateEntries)
        }
    }, [])

    const filteredProducts = []

    const itemTotal =
        products?.data.reduce(
            (acc, product) =>
                acc +
                (isProductMatch(product, query, selectedCategory) ? 1 : 0),
            0,
        ) ?? 0

    let skipCount = 0

    for (const product of products?.data ?? []) {
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
                        const filteredProducts =
                            products?.data.filter(product =>
                                product.barcode_reg_id
                                    ?.toLowerCase()
                                    .includes(data.toLowerCase()),
                            ) ?? []

                        if (filteredProducts.length === 1) {
                            const isProductCanBeAdded =
                                !filteredProducts[0].is_in_opname &&
                                (filteredProducts[0].warehouses.find(
                                    warehouse =>
                                        warehouse?.warehouse === WAREHOUSE,
                                )?.qty ?? 0) > 0

                            if (isProductCanBeAdded) {
                                handleAddProduct(filteredProducts[0])
                                debounceSetFieldValue()
                            }
                        }
                    }
                }}
            />

            <SearchTextField
                value={query ?? ''}
                onValueChange={debounceSetQuery}
            />

            <CategoryChips
                data={products?.data ?? []}
                onSelect={category => {
                    setSelectedCategory(category)
                    setCurrentSearchPageNo(1)
                }}
            />

            <ResultNav
                currentSearchPageNo={currentSearchPageNo}
                itemTotal={itemTotal}
                productPerPage={PRODUCT_PER_PAGE}
                fetchedAt={products?.fetched_at}
                onRefresh={() => {
                    mutate()
                }}
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
                                    qty={getQty(product)}
                                    defaultSellPrice={
                                        getWarehouse(product)
                                            ?.default_sell_price ?? 0
                                    }
                                    searchText={query}
                                    data={product}
                                    onClick={() => {
                                        handleAddProduct(product)
                                        debounceSetFieldValue()
                                    }}
                                />
                            ))}
                        </Masonry>

                        <ScrollableXBox
                            display="flex"
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
                                    qty={getQty(product)}
                                    defaultSellPrice={
                                        getWarehouse(product)
                                            ?.default_sell_price ?? 0
                                    }
                                    searchText={query}
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
    const isBarcodeMatch =
        product.barcode_reg_id?.includes(query.toLowerCase()) ?? false

    return (
        isCategoryMatch &&
        (isNameMatch || isCodeMatch || isIdMatch || isBarcodeMatch)
    )
}

function getWarehouse(product: Product) {
    return product.warehouses.find(
        warehouse => warehouse.warehouse === WAREHOUSE,
    )
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

function getQty(product: Product) {
    const warehouseQty = getWarehouse(product)?.qty ?? 0

    const queuedQty = entries.reduce(
        (acc, entry) =>
            acc +
            entry.body.details.reduce(
                (acc2, detail) =>
                    detail.product_id === product.id ? acc2 + detail.qty : acc2,
                0,
            ),
        0,
    )

    const selectedQty =
        detailsTemp.find(({ product_id }) => product_id === product.id)?.qty ??
        0

    return warehouseQty - queuedQty - selectedQty
}
