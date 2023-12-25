// types
import type { AxiosError } from 'axios'
// vendors
import Axios from 'axios'
// utils
import getCookie from '@/utils/getCookie'
import handleRequestError from './axios/handleRequestError'
import handleServerError from './axios/handleServerError'

const axios = Axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
})

axios.interceptors.request.use(request => {
    if (request.method !== 'get') {
        const csrf = getCookie(request.xsrfCookieName || 'XSRF-TOKEN')

        if (csrf) {
            request.headers[request.xsrfHeaderName || 'X-XSRF-TOKEN'] = csrf
        }
    }

    return request
})

axios.interceptors.response.use(undefined, (error: AxiosError) => {
    const { response, request } = error

    if (response) {
        handleServerError(response)
    } else if (request) {
        handleRequestError(error)
    }

    return Promise.reject(error)
})

export default axios
