import { useState } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import dynamic from 'next/dynamic'

import axios from '@/lib/axios'

import Head from 'next/head'
import Grid from '@mui/material/Grid'
import { Card, CardContent, Fab } from '@mui/material'

import PersonAddIcon from '@mui/icons-material/PersonAdd'

import AuthLayout from '@/components/Layouts/AuthLayout'
import Summary from '@/components/User/Summary'
import UserSelect from '@/components/User/Select'
import UserForm from '@/components/User/Form'
import UserDetailsTabCard from '@/components/User/DetailsTabCard'

const DynamicUserCard = dynamic(() => import('@/components/User/Card'))

export default function users() {
    const router = useRouter()
    const uuid = router.query.uuid

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [userDraft, setUserDraft] = useState({})

    const userSelectOnChange = async (e, value) => {
        if (!value) return

        router.push(`/users/${value.uuid}`)
    }

    const { data: userWithDetails = {}, isLoading } = useSWR(
        uuid ? `/users/${uuid}` : null,
        async url => {
            const { data } = await axios.get(url)
            return data
        },
    )

    return (
        <AuthLayout pageTitle="Pengguna">
            <Head>
                <title>{`Pengguna — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <Grid
                container
                spacing={3}
                sx={{
                    flexDirection: {
                        xs: 'column-reverse',
                        sm: 'column-reverse',
                        md: 'row',
                    },
                }}>
                <Grid
                    item
                    sm={12}
                    md={8}
                    width="100%"
                    display="flex"
                    flexDirection="column"
                    gap={3}>
                    <UserSelect onChange={userSelectOnChange} />

                    {isFormOpen ? (
                        <Card>
                            <CardContent>
                                <UserForm
                                    data={userDraft}
                                    onClose={() => setIsFormOpen(false)}
                                />
                            </CardContent>
                        </Card>
                    ) : (
                        <DynamicUserCard
                            data={userWithDetails}
                            isLoading={isLoading}
                            openEditForm={() => {
                                setUserDraft(userWithDetails)
                                setIsFormOpen(true)
                            }}
                        />
                    )}

                    {!isFormOpen && (
                        <UserDetailsTabCard
                            data={userWithDetails}
                            isLoading={isLoading}
                        />
                    )}
                </Grid>

                <Grid item sm={12} md={4} width="100%">
                    <Summary />
                </Grid>
            </Grid>

            <Fab
                disabled={isFormOpen || isLoading}
                onClick={() => {
                    setUserDraft({})
                    setIsFormOpen(true)
                }}
                color="success"
                aria-label="tambah pengguna"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <PersonAddIcon />
            </Fab>
        </AuthLayout>
    )
}
