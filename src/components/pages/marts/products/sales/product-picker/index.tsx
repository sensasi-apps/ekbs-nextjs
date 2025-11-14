'use client'

import Masonry from '@mui/lab/Masonry'
// materials
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
// types
import type { FieldProps } from 'formik'
// vendors
import { memo, useEffect, useState } from 'react'
import BarcodeReader from 'react-barcode-reader'
import useSWR from 'swr'
import { useDebouncedCallback } from 'use-debounce'
import ScrollableXBox from '@/components/scrollable-x-box'
import type Product from '@/modules/mart/types/orms/product'
import type { FormattedEntry } from '@/sw/functions/handle-message'
import { postToSw } from '@/utils/post-to-sw'
import ApiUrl from '../../../../../../app/mart-product-sales/_parts/enums/api-url'
import type { FormikStatusType, FormValuesType } from '../formik-wrapper'
import type { SubmittedData } from '../formik-wrapper/@types/submitted-data'
// sub-components
import CategoryChips from './components/category-chips'
import ProductCard from './components/product-card'
import ResultNav from './components/result-nav'
import SearchTextField from './components/search-text-field'

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
        refreshInterval: 15 * 60 * 1000, // 15 minutes
        revalidateOnReconnect: true,
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

    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            typeof window.navigator !== 'undefined'
        ) {
            function updateProductData() {
                setTimeout(() => {
                    mutate()
                }, 7000) // 7 seconds
            }

            addEventListener('mart-sale-queued', updateProductData)

            return () =>
                removeEventListener('mart-sale-queued', updateProductData)
        }
    }, [mutate])

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

    if (currentSearchPageNo > maxPage) {
        setCurrentSearchPageNo(maxPage)
    }

    return (
        <Paper
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 3,
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
                onValueChange={debounceSetQuery}
                value={query ?? ''}
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
                fetchedAt={products?.fetched_at}
                itemTotal={itemTotal}
                onNext={() =>
                    setCurrentSearchPageNo(prev =>
                        prev + 1 > maxPage ? 1 : prev + 1,
                    )
                }
                onPrev={() =>
                    setCurrentSearchPageNo(prev =>
                        prev - 1 === 0 ? maxPage : prev - 1,
                    )
                }
                productPerPage={PRODUCT_PER_PAGE}
            />

            <Box display="flex" justifyContent="center">
                {isLoading ? (
                    <Typography
                        align="center"
                        color="text.disabled"
                        variant="body2">
                        Memuat produk...
                    </Typography>
                ) : (
                    <>
                        <Masonry
                            columns={4}
                            spacing={2}
                            sx={{
                                display: { sm: 'flex', xs: 'none' },
                            }}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    data={product}
                                    defaultSellPrice={
                                        getWarehouse(product)
                                            ?.default_sell_price ?? 0
                                    }
                                    key={product.id}
                                    onClick={() => {
                                        handleAddProduct(product)
                                        debounceSetFieldValue()
                                    }}
                                    qty={getQty(product)}
                                    searchText={query}
                                />
                            ))}
                        </Masonry>

                        <ScrollableXBox
                            display="flex"
                            sx={{
                                '& > .MuiPaper-root': {
                                    minWidth: 200,
                                    whiteSpace: 'wrap',
                                    width: 200,
                                },
                                display: { sm: 'none', xs: 'flex' },
                            }}>
                            {filteredProducts.map(product => (
                                <ProductCard
                                    data={product}
                                    defaultSellPrice={
                                        getWarehouse(product)
                                            ?.default_sell_price ?? 0
                                    }
                                    key={product.id}
                                    onClick={() => {
                                        handleAddProduct(product)
                                        debounceSetFieldValue()
                                    }}
                                    qty={getQty(product)}
                                    searchText={query}
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
