// vendors
import { AxiosError } from 'axios'
import { sha3_256 } from 'js-sha3'
import { useEffect, useState, useCallback, type FormEvent } from 'react'
import { useRouter } from 'next/router'
//
import type AuthInfo from '@/features/user--auth/types/auth-info'
import axios from '@/lib/axios'
import useAuthInfoState from '@/hooks/use-auth-info-state'

// ============================
// Helpers
// ============================
function parseBase64Response(encoded: string) {
    try {
        return JSON.parse(atob(encoded)) as { status: number; message: string }
    } catch {
        return { status: 500, message: 'Terjadi kesalahan' }
    }
}

function createAuthInfoKey(email: string, password: string) {
    return sha3_256(email + password)
}

function getStoredAuthInfo(
    email: string,
    password: string,
): AuthInfo | undefined {
    const key = createAuthInfoKey(email, password)
    const stored = localStorage.getItem(key)
    return stored ? (JSON.parse(stored) as AuthInfo) : undefined
}

async function loginUser(
    email: string,
    password: string,
    setAuthInfo: (info: AuthInfo | undefined) => void,
) {
    const key = createAuthInfoKey(email, password)
    const storedAuthInfo = getStoredAuthInfo(email, password)

    setAuthInfo(storedAuthInfo)

    try {
        const { data } = await axios.post<AuthInfo>('/login', {
            email,
            password,
        })
        const dataJson = JSON.stringify(data)

        if (JSON.stringify(storedAuthInfo) !== dataJson) {
            setAuthInfo(data)
            localStorage.setItem(key, dataJson)
        }
    } catch (err) {
        const error = err as AxiosError<{ message?: string }>
        if (error.code === AxiosError.ERR_NETWORK && storedAuthInfo) {
            return
        }

        setAuthInfo(undefined)
        throw error
    }
}

function buildErrorResponse(err: AxiosError<{ message?: string }>) {
    return {
        status: err.response?.status,
        message:
            err.response?.data.message ??
            err.response?.statusText ??
            err.message,
    }
}

// ============================
// Hook
// ============================
export function useHooks() {
    const [, setAuthInfo] = useAuthInfoState()
    const { query, replace } = useRouter()
    const { response } = query

    const [isError, setIsError] = useState(false)
    const [message, setMessage] = useState<string>()
    const [isLoading, setIsLoading] = useState(false)

    // Handle response from URL params (OAuth / Reset Password redirection)
    useEffect(() => {
        if (!response) return
        const parsed = parseBase64Response(response as string)

        if (parsed.status === 200) {
            setIsLoading(true)
        } else {
            setMessage(parsed.message)
            setIsError(parsed.status >= 400)
        }
    }, [response])

    const handleSubmit = useCallback(
        async (event: FormEvent<HTMLFormElement>) => {
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

            try {
                await loginUser(email, password, setAuthInfo)
            } catch (err) {
                const errorResponse = buildErrorResponse(
                    err as AxiosError<{ message?: string }>,
                )
                setIsLoading(false)
                replace(
                    `/login?response=${btoa(JSON.stringify(errorResponse))}`,
                )
            }
        },
        [setAuthInfo, replace],
    )

    return { isLoading, isError, message, handleSubmit }
}
