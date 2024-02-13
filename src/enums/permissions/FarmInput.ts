enum FarmInput {
    CREATE_PRODUCT = 'create product',
    UPDATE_PRODUCT = 'update product',
    READ_PRODUCT = 'read products', //TODO=sync this
    DELETE_PRODUCT = 'delete product',

    CREATE_PRODUCT_PURCHASE = 'create product purchase',
    UPDATE_PRODUCT_PURCHASE = 'update product purchase',
    READ_PRODUCT_PURCHASE = 'read product purchases', // TODO: sync this

    CREATE_PRODUCT_OPNAME = 'create product opname',
    // UPDATE_PRODUCT_OPNAME='update product opnames',
    // READ_PRODUCT_OPNAME='read product opnames', // TODO: sync this
    // DELETE_PRODUCT_OPNAME='delete product opname',

    CREATE_PRODUCT_SALE = 'create product sale',
    // UPDATE_PRODUCT_SALE='update product sales',
    READ_PRODUCT_SALE = 'read product sales', // TODO: sync this
    REFUND_PRODUCT_SALE = 'refund product sale',
}

export default FarmInput
