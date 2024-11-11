import { stringify } from 'qs'
import axios from '@/lib/axios'

/**
 * Fetches data from the given endpoint using axios.
 */
export async function fetcher(endpointPassed: [string, object] | string) {
    const [endpoint, params] =
        endpointPassed instanceof Array ? endpointPassed : [endpointPassed, {}]

    return axios
        .get(endpoint, {
            params: params,
            paramsSerializer: params => stringify(params),
        })
        .then(res => res.data)
}
