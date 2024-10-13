import { createContext, ReactNode, useContext } from 'react'
import { useRouter } from 'next/router'
import useSWR, { SWRResponse } from 'swr'
import axios from '@/lib/axios'
import User from '@/dataTypes/User'

const UserWithDetailsCtx = createContext<SWRResponse>({} as SWRResponse)

const userWithDetailsFetcher = (url: string) =>
    axios.get(url).then(response => response.data)

export function UserWithDetailsProvider({ children }: { children: ReactNode }) {
    const router = useRouter()
    const uuid = router.query.uuid

    const swr = useSWR<User>(
        uuid ? `/users/${uuid}` : null,
        userWithDetailsFetcher,
    )

    return (
        <UserWithDetailsCtx.Provider value={swr}>
            {children}
        </UserWithDetailsCtx.Provider>
    )
}

const useUserWithDetails = () => useContext(UserWithDetailsCtx)

export default useUserWithDetails
