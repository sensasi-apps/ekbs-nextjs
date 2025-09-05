// vendors
import { useRouter } from 'next/navigation'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Link from '@mui/material/Link'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
// icons-materials
import Close from '@mui/icons-material/Close'
import Edit from '@mui/icons-material/Edit'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// global components
import IconButton from '@/components/IconButton'
import LoadingCenter from '@/components/loading-center'
import ChipSmall from '@/components/ChipSmall'
import FlexBox from '@/components/flex-box'
// local components
import SetPasswordButtonAndDialogForm from '@/modules/user/components/password-form-dialog-with-button'
import IsActiveDisplay from '@/components/User/IsActiveDisplay'
import UserRoleChips from '@/components/User/RoleChips'
// providers
import useFormData from '@/providers/FormData'
//
import RolesAndPermissionButtonAndDialogForm from './roles-and-permission-button-and-dialog-form'
import useUserWithDetails from './user-with-details-provider'

export default function UserCard() {
    const { back } = useRouter()
    const { handleEdit } = useFormData()
    const { data: userWithDetails, isLoading } = useUserWithDetails()

    const { name, role_names_id, id, email, uuid } = userWithDetails || {}

    const handleEditClick = () => handleEdit(userWithDetails)

    if (isLoading) return <LoadingCenter />

    return (
        <Card>
            <CardContent>
                <Box display="flex" justifyContent="space-between">
                    <FlexBox>
                        <Typography variant="h5" component="div">
                            {name}
                        </Typography>

                        <ChipSmall
                            label={`#${id}`}
                            color="info"
                            variant="outlined"
                        />
                    </FlexBox>

                    <IconButton
                        title="Tutup"
                        icon={Close}
                        color="warning"
                        onClick={() => {
                            back()
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
                        <UserRoleChips data={role_names_id} size="small" />
                    </Box>
                </Box>

                <IsActiveDisplay isActive={userWithDetails?.is_active} />

                <Box mt={2}>
                    <ChipSmall
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
                        onClick={e => e.stopPropagation()}
                        component={props => (
                            <Link
                                {...props}
                                href={`/public/profile/${uuid}`}
                                target="_blank"
                            />
                        )}
                        sx={{
                            color: 'text.disabled',
                        }}
                        variant="outlined"
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
