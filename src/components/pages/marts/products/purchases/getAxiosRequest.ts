import axios from '@/lib/axios'
import type { FormValues } from './Form'
import ApiUrl from './ApiUrl'
import type ProductMovement from '@/dataTypes/mart/ProductMovement'

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
