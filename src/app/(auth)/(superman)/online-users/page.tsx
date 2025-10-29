'use client'

import RefreshIcon from '@mui/icons-material/Refresh'
import LinearProgress from '@mui/material/LinearProgress'
import TextField from '@mui/material/TextField'
import { useState } from 'react'
import useSWR from 'swr'
import FlexBox from '@/components/flex-box'
import IconButton from '@/components/IconButton'
import PageTitle from '@/components/page-title'
import UserDisplay from '@/components/user-display'
import type UserORM from '@/modules/user/types/orms/user'

export default function Page() {
    const [search, setSearch] = useState('')

    const { data, mutate, isValidating } =
        useSWR<
            {
                name: UserORM['name']
                id: UserORM['id']
            }[]
        >('_/online-users')

    if (!data) return null

    const usersFiltered = data.filter(user => {
        return user.name.toLowerCase().includes(search.toLowerCase())
    })

    return (
        <>
            <PageTitle title="Pengguna Online" />

            <FlexBox>
                <TextField
                    fullWidth
                    label="Cari"
                    onChange={e => setSearch(e.target.value)}
                    size="small"
                />

                <IconButton
                    icon={RefreshIcon}
                    onClick={() => mutate()}
                    title="Segarkan"
                />
            </FlexBox>

            {isValidating && <LinearProgress color="success" />}

            <p>{usersFiltered.length} pengguna online</p>

            <ul>
                {usersFiltered.map(user => (
                    <li key={user.id}>
                        <UserDisplay data={user} />
                    </li>
                ))}
            </ul>
        </>
    )
}
