'use client'

// mui labs
import Masonry from '@mui/lab/Masonry'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader, { type CardHeaderProps } from '@mui/material/CardHeader'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import UserCard from '@/app/(auth)/systems/users/[uuid]/_parts/user-card'
// components
import BackButton from '@/components/back-button'
import LoadingCenter from '@/components/loading-center'
import UserAddressesCrudBox from '@/components/User/Address/crud-box'
import UserBankAccsCrudBox from '@/components/User/BankAccs/crud-box'
import { UserDetailCrud } from '@/components/User/Detail/Crud'
import UserEmployeeCrud from '@/components/User/Employee/Crud'
import UserMemberCrudCard from '@/components/User/Member/crud-card'
// page components
import { getRoleIconByIdName } from '@/components/User/RoleChips'
import UserSocialsCrudBox from '@/components/User/Socials/CrudBox'
import UserVehiclesCrudBox from '@/components/User/Vehicles/crud-box'
// utils
import Role from '@/enums/role'
// hooks
import { isUserHasRole } from '@/hooks/use-is-auth-has-role'
import UserDriversCrudBox from '@/modules/user/components/user-driver-crud-box'
import UserFormDialog from '@/modules/user/components/user-form-dialog'
import UserLandsCrud from '@/modules/user/components/user-land-crud'
// modules
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import { FormDataProvider } from '@/providers/FormData'

export default function Page() {
    const { data: userWithDetails, isLoading } = useUserDetailSwr()

    if (!userWithDetails) return <LoadingCenter />

    const {
        addresses = [],
        uuid,
        socials = [],
        employee,
        driver,
        drivers = [],
        vehicles = [],
    } = userWithDetails

    return (
        <>
            <BackButton />

            <Box display="flex" flexDirection="column" gap={3}>
                <FormDataProvider>
                    <UserFormDialog />

                    <UserCard />
                </FormDataProvider>

                <UserDetailCrud />

                <Masonry
                    columns={{
                        md: 2,
                        sm: 1,
                        xs: 1,
                    }}
                    spacing={2}
                    sx={{
                        m: 0,
                    }}>
                    <Card>
                        <CardContent>
                            <UserSocialsCrudBox
                                data={socials}
                                isLoading={isLoading}
                                userUuid={uuid}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <UserAddressesCrudBox
                                data={addresses}
                                isLoading={isLoading}
                                userUuid={uuid}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <UserBankAccsCrudBox />
                        </CardContent>
                    </Card>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.EMPLOYEE, userWithDetails)}
                        unmountOnExit>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('karyawan')}
                                title="Kepegawaian"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserEmployeeCrud
                                    data={employee}
                                    userUuid={uuid}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.MEMBER, userWithDetails)}
                        unmountOnExit>
                        <div>
                            <UserMemberCrudCard />
                        </div>
                    </Fade>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.FARMER, userWithDetails)}
                        unmountOnExit>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('petani')}
                                title="Daftar Kebun"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserLandsCrud />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('pengangkut')}
                                title="Daftar Pengemudi"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserDriversCrudBox
                                    courierUserUuid={uuid}
                                    data={drivers}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('pengangkut')}
                                title="Daftar Kendaraan Pengangkut"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserVehiclesCrudBox
                                    courierUserUuid={uuid}
                                    data={vehicles}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        exit={false}
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('pengemudi')}
                                title="Informasi Pengemudi"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <Typography color="GrayText" variant="caption">
                                    No. SIM:
                                </Typography>
                                <Typography>
                                    {driver?.license_number}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Fade>
                </Masonry>
            </Box>
        </>
    )
}

const TITLE_TYPOGRAPHY_PROPS: CardHeaderProps['titleTypographyProps'] = {
    fontWeight: 'bold',
    variant: 'body1',
}

const PT_0_SX = { pt: 0 }
