import { createContext, useContext } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import axios from '@/lib/axios'
import User from '@/classes/user'

const UserWithDetailsCtx = createContext()

const userWithDetailsFetcher = url =>
    axios.get(url).then(response => new User(response.data))

export const UserWithDetailsProvider = ({ children }) => {
    const router = useRouter()
    const uuid = router.query.uuid

    const swr = useSWR(uuid ? `/users/${uuid}` : null, userWithDetailsFetcher)
    swr.isReady = uuid !== undefined

    return (
        <UserWithDetailsCtx.Provider value={swr}>
            {children}
        </UserWithDetailsCtx.Provider>
    )
}

const useUserWithDetails = () => useContext(UserWithDetailsCtx)

export default useUserWithDetails
