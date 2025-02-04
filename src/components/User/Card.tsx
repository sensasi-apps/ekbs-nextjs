// vendors
import { useRouter } from 'next/router'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import Close from '@mui/icons-material/Close'
import Edit from '@mui/icons-material/Edit'
// global components
import IconButton from '../IconButton'
// local components
import RolesAndPermissionButtonAndDialogForm from './RolesAndPermissions/ButtonAndDialogForm'
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm'
import IsActiveDisplay from './IsActiveDisplay'
import UserRoleChips from './RoleChips'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'

export default function UserCard() {
    const { push, query } = useRouter()
    const { handleEdit } = useFormData()
    const { data: userWithDetails, isLoading } = useUserWithDetails()

    const { name, role_names_id, id, email } = userWithDetails || {}

    const handleEditClick = () => handleEdit(userWithDetails)

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between">
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

                    <IconButton
                        title="Tutup"
                        icon={Close}
                        color="warning"
                        onClick={() => {
                            push({
                                pathname: '/users',
                                query: { role: query.role },
                            })
                        }}
                    />
                </Box>

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
