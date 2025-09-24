'use client'

import { type ReadonlyURLSearchParams, useRouter } from 'next/navigation'
import { useCallback } from 'react'

export default function useSetSearchParams(
    searchParams: ReadonlyURLSearchParams,
) {
    const { replace } = useRouter()

    const setSearchParams = useCallback(
        (newParams: { [key: string]: string | number }) => {
            const params = new URLSearchParams(searchParams.toString())

            for (const [key, value] of Object.entries(newParams)) {
                params.set(key, String(value))
            }

            replace(`?${params.toString()}`)
        },
        [searchParams],
    )

    return setSearchParams
}
