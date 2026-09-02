'use client'

import axios, { AxiosError } from 'axios'
// vendors
import { enqueueSnackbar } from 'notistack'
import { LS_KEY } from '@/hooks/use-auth-info'
import type AuthInfo from '@/modules/user/types/auth-info'
import { getCurrentAuthInfo } from '@/utils/get-current-auth-info'
// utils
import { handleServerError } from './axios/functions/handle-server-error'

const myAxios = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true,
})

export const currentAuthInfoPromise: Promise<AuthInfo | undefined> =
    typeof window === 'undefined'
        ? Promise.resolve(undefined)
        : myAxios
              .get('/sanctum/csrf-cookie')
              .then(() => myAxios.get<AuthInfo | null>('/current-auth-info'))
              .then(({ data }) => {
                  const currentAuthInfo = getCurrentAuthInfo()
                  const nextAuthInfo = data ?? undefined

                  if (
                      JSON.stringify(currentAuthInfo) !==
                      JSON.stringify(nextAuthInfo)
                  ) {
                      if (nextAuthInfo) {
                          localStorage.setItem(
                              LS_KEY,
                              JSON.stringify(nextAuthInfo),
                          )
                      } else {
                          localStorage.removeItem(LS_KEY)
                      }

                      window.location.reload()
                  }

                  return nextAuthInfo
              })
              .catch((error: AxiosError) => {
                  const { response, code, message } = error

                  if (response) {
                      handleServerError(response)
                  } else if (code !== AxiosError.ERR_NETWORK) {
                      enqueueSnackbar(message ?? 'Terjadi kesalahan.', {
                          persist: true,
                          variant: 'error',
                      })
                  }

                  if (response || code !== AxiosError.ERR_NETWORK) {
                      throw error
                  }

                  return getCurrentAuthInfo() ?? undefined
              })

myAxios.interceptors.request.use(config => {
    config.baseURL += '/api'

    return config
})

myAxios.interceptors.response.use(undefined, (error: AxiosError) => {
    const { response, code } = error

    if (response) {
        handleServerError(response)
    }

    if (code === AxiosError.ERR_NETWORK) {
        enqueueSnackbar(
            'Permintaan gagal dikirimkan, mohon periksa kembali koneksi internet anda.',
            {
                persist: true,
                variant: 'error',
            },
        )
    }

    throw error
})

export default myAxios
