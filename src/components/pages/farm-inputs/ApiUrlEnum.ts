import DatatableEndpointEnum from '@/modules/farm-inputs/enums/datatable-endpoint'

enum ApiUrlEnum {
    PRODUCT_PURCHASE_DATATABLE = DatatableEndpointEnum.PRODUCT_PURCHASES,
    UPDATE_OR_CREATE_PRODUCT_PURCHASE = 'farm-inputs/product-purchases$1',
}

export default ApiUrlEnum
