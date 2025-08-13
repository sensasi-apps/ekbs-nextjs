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
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
// global components
import IconButton from '../IconButton'
import LoadingCenter from '@/components/loading-center'
// local components
import RolesAndPermissionButtonAndDialogForm from './RolesAndPermissions/ButtonAndDialogForm'
import SetPasswordButtonAndDialogForm from './SetPasswordButtonAndDialogForm'
import IsActiveDisplay from './IsActiveDisplay'
import UserRoleChips from './RoleChips'
// providers
import useFormData from '@/providers/FormData'
import useUserWithDetails from '@/providers/UserWithDetails'
import ChipSmall from '../ChipSmall'
import FlexBox from '../flex-box'
import Link from '@mui/material/Link'

export default function UserCard() {
    const { push, query } = useRouter()
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
