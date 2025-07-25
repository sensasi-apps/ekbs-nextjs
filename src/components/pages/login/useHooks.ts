// types
import type { AxiosError } from 'axios'
// vendors
import { useEffect, useState, type FormEvent } from 'react'
import { useRouter } from 'next/router'
// hooks
import useAuth from '@/providers/Auth'

export function useHooks() {
    const { login } = useAuth()
    const { query, replace } = useRouter()
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
            } catch {
                temp = { status: 500, message: 'Terjadi kesalahan' }
            }

            if (temp.status === 200) {
                setIsLoading(true)
            } else {
                setMessage(temp.message)
                setIsError(temp.status >= 400)
            }
        }
    }, [response])

    return {
        isLoading,
        isError,
        message,
        handleSubmit: (event: FormEvent<HTMLFormElement>) => {
            event.preventDefault()

            const formEl = event.currentTarget

            if (!formEl.checkValidity()) {
                formEl.reportValidity()
                return
            }

            setIsLoading(true)
            setIsError(false)
            setMessage(undefined)

            const formData = new FormData(formEl)

            login(
                formData.get('email') as string,
                formData.get('password') as string,
            ).catch(
                ({
                    response,
                    message,
                }: AxiosError<{
                    message?: string
                }>) => {
                    const errorResponse = {
                        status: response?.status,
                        message:
                            response?.data.message ??
                            response?.statusText ??
                            message,
                    }

                    setIsLoading(false)

                    replace(
                        `/login?response=${btoa(JSON.stringify(errorResponse))}`,
                    )
                },
            )
        },
    }
}
