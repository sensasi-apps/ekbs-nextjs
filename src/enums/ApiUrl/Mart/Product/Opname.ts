import ApiUrl from '@/app/mart-product-sales/_parts/enums/api-url'

enum OpnameApiUrl {
    CATEGORIES_DATA = 'marts/products/opnames/data/categories',
    PRODUCTS_DATA = ApiUrl.PRODUCTS,
    DATATABLE = 'marts/products/opnames/datatable',

    CREATE = 'marts/products/opnames',
    ADD_PRODUCTS = 'marts/products/opnames/$/add-products',
    UPDATE_OR_GET_DETAIL = 'marts/products/opnames/$',
    REMOVE_PRODUCT = 'marts/products/opnames/$pmdId/remove-product',
    FINISH = 'marts/products/opnames/$/finish',
    UPDATE_DETAIL_QTYS = 'marts/products/opnames/update-detail-qtys',

    REPORTS = 'marts/products/opnames/reports',
}

export default OpnameApiUrl
