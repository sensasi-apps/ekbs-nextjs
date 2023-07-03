import { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import axios from '@/lib/axios'

import { Box, Button, Card, CardContent, Fab } from '@mui/material'

import PersonAddIcon from '@mui/icons-material/PersonAdd'

import ActivationToggle from './ActivationToggle'
import RolesAndPermissionButtonAndDialogForm from './RolesAndPermissions/ButtonAndDialogForm'
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm'
import UserBox from './Box'
import UserDetailsTabCard from './DetailsTabCard'
import UserForm from './Form'

export default function UserCards() {
    const [userDraft, setUserDraft] = useState(undefined)
    const router = useRouter()
    const uuid = router.query.uuid

    const userWithDetailsFetcher = async url => {
        const { data } = await axios.get(url)
        return data
    }

    const { data: userWithDetails, isLoading } = useSWR(
        uuid ? `/users/${uuid}` : null,
        userWithDetailsFetcher,
    )

    return (
        <>
            {uuid && userDraft === undefined && (
                <>
                    <Card>
                        <CardContent>
                            <UserBox
                                data={userWithDetails}
                                isLoading={isLoading}>
                                <ActivationToggle
                                    data={userWithDetails}
                                    isLoading={isLoading}
                                    disabled
                                />

                                <Box
                                    mt={2}
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center">
                                    <SetPasswordButtonAndDialogForm
                                        data={userWithDetails}
                                        isLoading={isLoading}
                                    />
                                    <RolesAndPermissionButtonAndDialogForm
                                        data={userWithDetails}
                                    />
                                    <Button
                                        disabled={isLoading}
                                        size="small"
                                        color="warning"
                                        onClick={() =>
                                            setUserDraft({ ...userWithDetails })
                                        }>
                                        Perbaharui data akun
                                    </Button>
                                </Box>
                            </UserBox>
                        </CardContent>
                    </Card>

                    {userDraft === undefined && (
                        <UserDetailsTabCard
                            data={userWithDetails}
                            isLoading={isLoading}
                        />
                    )}
                </>
            )}

            {userDraft !== undefined && (
                <Card>
                    <CardContent>
                        <UserForm
                            data={userDraft}
                            onClose={() => setUserDraft(undefined)}
                        />
                    </CardContent>
                </Card>
            )}

            <Fab
                disabled={userDraft !== undefined}
                onClick={() => setUserDraft(null)}
                color="success"
                aria-label="tambah pengguna"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <PersonAddIcon />
            </Fab>
        </>
    )
}
