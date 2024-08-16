// types
import type { AxiosError } from 'axios'
// vendors
import { useEffect, useState, FormEvent } from 'react'
import { useRouter } from 'next/router'
// hooks
import useAuth from '@/providers/Auth'

export function useHooks() {
    const { login } = useAuth()
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

            const email = formData.get('email') as string
            const password = formData.get('password') as string

            login(email, password).catch(
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
    }
}
