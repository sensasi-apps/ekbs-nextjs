import PropTypes from 'prop-types'

import { Box, Button, Card, CardContent } from '@mui/material'

import RolesAndPermissionButtonAndDialogForm from './RolesAndPermissions/ButtonAndDialogForm'
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm'
import UserBox from './Box'
import IsActiveDisplay from './IsActiveDisplay'

function UserCard({ data: userWithDetails, isLoading, openEditForm }) {
    if (!userWithDetails.uuid && !isLoading) return null

    return (
        <Card>
            <CardContent>
                <UserBox data={userWithDetails}>
                    <IsActiveDisplay isActive={userWithDetails?.is_active} />

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
                            onClick={() => openEditForm(userWithDetails)}>
                            Perbaharui data akun
                        </Button>
                    </Box>
                </UserBox>
            </CardContent>
        </Card>
    )
}

UserCard.propTypes = {
    data: PropTypes.object.isRequired,
    openEditForm: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
}

export default UserCard
