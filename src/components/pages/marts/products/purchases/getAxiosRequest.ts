import axios from '@/lib/axios'
import { FormValues } from './Form'
import ApiUrl from './ApiUrl'
import ProductMovement from '@/dataTypes/mart/ProductMovement'

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
