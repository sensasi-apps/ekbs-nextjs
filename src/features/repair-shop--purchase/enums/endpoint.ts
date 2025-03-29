enum Endpoint {
    SPARE_PARTS_LIST = 'repair-shop/spare-parts',
    DATATABLE = 'repair-shop/spare-parts/purchases/datatable',
    CREATE = 'repair-shop/spare-parts/purchases',
    UPDATE = 'repair-shop/spare-parts/purchases/$1',
    READ = Endpoint.UPDATE,
}

export default Endpoint
