import { createContext, type ReactNode, useContext } from 'react'
import { useParams } from 'next/navigation'
import useSWR, { type SWRResponse } from 'swr'
//
import axios from '@/lib/axios'
import type User from '@/modules/auth/types/orms/user'

const UserWithDetailsCtx = createContext<SWRResponse>({} as SWRResponse)

const userWithDetailsFetcher = (url: string) =>
    axios.get(url).then(response => response.data)

/**
 * @deprecated use formik instead
 */
export function UserWithDetailsProvider({ children }: { children: ReactNode }) {
    const params = useParams()
    const uuid = params?.uuid as string | undefined

    const swr = useSWR<User>(
        uuid ? `users/${uuid}` : null,
        userWithDetailsFetcher,
    )

    return (
        <UserWithDetailsCtx.Provider value={swr}>
            {children}
        </UserWithDetailsCtx.Provider>
    )
}

/**
 * @deprecated use formik instead
 */
const useUserWithDetails = () => useContext(UserWithDetailsCtx)

export default useUserWithDetails
