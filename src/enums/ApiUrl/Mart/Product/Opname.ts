import ApiUrl from '@/components/pages/marts/products/sales/ApiUrl'

enum OpnameApiUrl {
    CATEGORIES_DATA = 'marts/products/opnames/data/categories',
    PRODUCTS_DATA = ApiUrl.PRODUCTS,
    DATATABLE = 'marts/products/opnames/datatable',

    CREATE = 'marts/products/opnames/',
    ADD_PRODUCT = 'marts/products/opnames/$/add-products',
    GET_DETAIL = 'marts/products/opnames/$',
    REMOVE_PRODUCT = 'marts/products/opnames/$pmdId/remove-product',
}

export default OpnameApiUrl
