// types
import type { AxiosError } from 'axios'
import type UserType from '@/dataTypes/User'
// vendors
import { useEffect, useState, FormEvent, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from '@/lib/axios'
// hooks
import useAuth from '@/providers/Auth'

export function useHooks() {
    const { onLoginSuccess } = useAuth()
    const { query } = useRouter()
    const { response } = query

    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)

    /**
     * Handle response from url params
     * redirection from:
     *  - oauth-backend redirection
     *  - reset-password page
     */
    useEffect(() => {
        if (response) {
            let temp: {
                status: number
                message: string
            }

            try {
                temp = JSON.parse(atob(response as string))
            } catch (error) {
                temp = { status: 500, message: 'Terjadi kesalahan' }
            }

            if (temp.status === 200) {
                setIsLoading(true)
            } else {
                setMessage(temp.message)
                setIsError(true)
            }
        }
    }, [response])

    const handleSubmit = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            const formEl = event.currentTarget

            if (!formEl.checkValidity()) {
                formEl.reportValidity()
                return
            }

            setIsLoading(true)
            setIsError(false)
            setMessage(undefined)

            axios
                .post<UserType>('/login', new FormData(formEl))
                .then(res => onLoginSuccess(res.data))
                .catch(
                    ({
                        response,
                        message,
                    }: AxiosError<{
                        // php / laravel exception
                        message?: string
                    }>) => {
                        setMessage(
                            response?.data.message ??
                                response?.statusText ??
                                message,
                        )

                        setIsError(true)
                        setIsLoading(false)
                    },
                )
        },
        // TODO: tell eslint that onLoginSuccess is never change
        [onLoginSuccess],
    )

    return {
        isLoading,
        isError,
        message,
        handleSubmit,
    }
}
