import axios from '@/lib/axios'
import type ProductMovement from '@/modules/mart/types/orms/product-movement'
import ApiUrl from './api-url'
import type { FormValues } from './form'

export default function getAxiosRequest(
    action: 'create' | 'update',
    uuid?: ProductMovement['uuid'],
    values?: FormValues,
) {
    switch (action) {
        case 'create':
            return axios.post(ApiUrl.CREATE, values)

        case 'update':
            return axios.put(ApiUrl.UPDATE.replace('$', uuid ?? ''), values)

        default:
            throw new Error('Invalid action')
    }
}
