// materials
import {
    Box,
    Button,
    Card,
    CardContent,
    Skeleton,
    Typography,
} from '@mui/material'
import { Edit } from '@mui/icons-material'
// local components
import RolesAndPermissionButtonAndDialogForm from './RolesAndPermissions/ButtonAndDialogForm'
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm'
import IsActiveDisplay from './IsActiveDisplay'
import UserRoleChips from './RoleChips'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'

export default function UserCard() {
    const { handleEdit } = useFormData()
    const { data: userWithDetails, isLoading } = useUserWithDetails()

    const { name, role_names_id, id, email } = userWithDetails || {}

    const handleEditClick = () => handleEdit(userWithDetails)

    return (
        <Card>
            <CardContent>
                <Box>
                    <Typography variant="h5" component="div">
                        {isLoading ? <Skeleton /> : name}

                        {!isLoading && (
                            <Typography
                                variant="h6"
                                ml={1}
                                color="GrayText"
                                component="span">
                                #{id}
                            </Typography>
                        )}
                    </Typography>

                    <Typography variant="caption" color="GrayText">
                        {isLoading ? (
                            <Skeleton />
                        ) : (
                            email || <i>E-mail untuk akun belum ditambahkan</i>
                        )}
                    </Typography>

                    <Box mt={2} mb={1}>
                        <Typography variant="body2" color="GrayText">
                            Peran:
                            <Box component="span" ml={1}>
                                <RolesAndPermissionButtonAndDialogForm
                                    isLoading={!userWithDetails}
                                    data={userWithDetails}
                                />
                            </Box>
                        </Typography>

                        <Box
                            sx={{
                                '& > *': {
                                    mr: 0.3,
                                    mb: 0.3,
                                },
                            }}>
                            <UserRoleChips data={role_names_id} size="small" />
                        </Box>
                    </Box>

                    <IsActiveDisplay isActive={userWithDetails?.is_active} />
                </Box>

                <Box
                    mt={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center">
                    <Button
                        disabled={isLoading}
                        size="small"
                        color="info"
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={handleEditClick}>
                        Perbaharui data akun
                    </Button>

                    <SetPasswordButtonAndDialogForm data={userWithDetails} />
                </Box>
            </CardContent>
        </Card>
    )
}
