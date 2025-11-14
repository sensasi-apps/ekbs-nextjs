// vendors

// icons-materials
import Edit from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import FlexBox from '@/components/flex-box'
// global components
import LoadingCenter from '@/components/loading-center'
import IsActiveDisplay from '@/components/User/IsActiveDisplay'
import UserRoleChips from '@/components/User/RoleChips'
// local components
import SetPasswordButtonAndDialogForm from '@/modules/user/components/password-form-dialog-with-button'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
// providers
import useFormData from '@/providers/FormData'
//
import RolesAndPermissionButtonAndDialogForm from './roles-and-permission-button-and-dialog-form'

export default function UserCard() {
    const { handleEdit } = useFormData()
    const { data: userWithDetails, isLoading } = useUserDetailSwr()

    if (isLoading || !userWithDetails) return <LoadingCenter />

    const { name, role_names_id, id, email, uuid } = userWithDetails || {}

    const handleEditClick = () => handleEdit(userWithDetails)

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between">
                    <FlexBox>
                        <Typography component="div" variant="h5">
                            {name}
                        </Typography>

                        <Chip
                            color="info"
                            label={`#${id}`}
                            size="small"
                            variant="outlined"
                        />
                    </FlexBox>
                </Box>

                <Typography color="GrayText" variant="caption">
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        (email ?? <i>E-mail untuk akun belum ditambahkan</i>)
                    )}
                </Typography>

                <Box my={2}>
                    <Typography color="GrayText" variant="body2">
                        Peran:
                        <Box component="span" ml={1}>
                            <RolesAndPermissionButtonAndDialogForm
                                data={userWithDetails}
                                isLoading={!userWithDetails}
                            />
                        </Box>
                    </Typography>

                    <Box
                        sx={{
                            '& > *': {
                                mb: 0.3,
                                mr: 0.3,
                            },
                        }}>
                        <UserRoleChips
                            data={role_names_id ?? []}
                            size="small"
                        />
                    </Box>
                </Box>

                <IsActiveDisplay isActive={userWithDetails?.is_active} />

                <Box mt={2}>
                    <Chip
                        component={Link}
                        href={`/public/profile/${uuid as string}`}
                        label={
                            <>
                                Profil Publik{' '}
                                <OpenInNewIcon
                                    sx={{
                                        fontSize: '0.75rem',
                                    }}
                                />
                            </>
                        }
                        size="small"
                        sx={{
                            color: 'text.disabled',
                        }}
                        target="_blank"
                        variant="outlined"
                    />
                </Box>

                <Box
                    alignItems="center"
                    display="flex"
                    justifyContent="space-between"
                    mt={4}>
                    <Button
                        color="info"
                        disabled={isLoading}
                        onClick={handleEditClick}
                        size="small"
                        startIcon={<Edit />}
                        variant="outlined">
                        Perbaharui data akun
                    </Button>

                    <SetPasswordButtonAndDialogForm data={userWithDetails} />
                </Box>
            </CardContent>
        </Card>
    )
}
