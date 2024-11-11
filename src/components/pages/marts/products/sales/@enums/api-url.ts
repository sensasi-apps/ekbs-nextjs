enum ApiUrl {
    // GET = 'marts/products/sales',
    // POST = 'marts/products/sales',
    // PUT = 'marts/products/sales',
    // DELETE = 'marts/products/sales',
    STORE = 'marts/products/sales',

    // get data
    SALES_REPORT = 'marts/products/sales/report',
    BALANCE_IN_SUMMARY = 'marts/products/sales/balance-in-summary',
    DATATABLE = 'marts/products/sales/datatable',
    PRODUCTS = 'marts/products',

    /**
     * Disable this endpoint because it's not used in the project
     *
     * @see https://github.com/sensasi-apps/ekbs-nextjs/issues/434
     */
    // NEW_SALE_NUMBER = 'marts/products/sales/new-sale-number',

    USERS = 'marts/products/sales/users',
    CASHES = 'marts/products/sales/cashes',
}

export default ApiUrl
