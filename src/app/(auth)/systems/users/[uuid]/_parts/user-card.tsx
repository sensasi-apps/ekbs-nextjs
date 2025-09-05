// vendors
import Link from 'next/link'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import Edit from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// global components
import LoadingCenter from '@/components/loading-center'
import FlexBox from '@/components/flex-box'
// local components
import SetPasswordButtonAndDialogForm from '@/modules/user/components/password-form-dialog-with-button'
import IsActiveDisplay from '@/components/User/IsActiveDisplay'
import UserRoleChips from '@/components/User/RoleChips'
// providers
import useFormData from '@/providers/FormData'
//
import RolesAndPermissionButtonAndDialogForm from './roles-and-permission-button-and-dialog-form'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'

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
                        <Typography variant="h5" component="div">
                            {name}
                        </Typography>

                        <Chip
                            size="small"
                            label={`#${id}`}
                            color="info"
                            variant="outlined"
                        />
                    </FlexBox>
                </Box>

                <Typography variant="caption" color="GrayText">
                    {isLoading ? (
                        <Skeleton />
                    ) : (
                        (email ?? <i>E-mail untuk akun belum ditambahkan</i>)
                    )}
                </Typography>

                <Box my={2}>
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
                        <UserRoleChips
                            data={role_names_id ?? []}
                            size="small"
                        />
                    </Box>
                </Box>

                <IsActiveDisplay isActive={userWithDetails?.is_active} />

                <Box mt={2}>
                    {/* @ts-expect-error IDK BRO `/public/profile/` is not detected as Route */}
                    <Chip
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
                        component={Link}
                        href={`/public/profile/${uuid as string}`}
                        target="_blank"
                        sx={{
                            color: 'text.disabled',
                        }}
                        variant="outlined"
                        size="small"
                    />
                </Box>

                <Box
                    mt={4}
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
