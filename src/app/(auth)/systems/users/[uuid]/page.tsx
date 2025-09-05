'use client'

// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader, { type CardHeaderProps } from '@mui/material/CardHeader'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
// mui labs
import Masonry from '@mui/lab/Masonry'
// page components
import { getRoleIconByIdName } from '@/components/User/RoleChips'
import { UserDetailCrud } from '@/components/User/Detail/Crud'
import UserAddressesCrudBox from '@/components/User/Address/crud-box'
import UserBankAccsCrudBox from '@/components/User/BankAccs/crud-box'
import UserDriversCrudBox from '@/modules/user/components/user-driver-crud-box'
import UserEmployeeCrud from '@/components/User/Employee/Crud'
import UserLandsCrud from '@/modules/user/components/user-land-crud'
import UserMemberCrudCard from '@/components/User/Member/crud-card'
import UserSocialsCrudBox from '@/components/User/Socials/CrudBox'
import UserVehiclesCrudBox from '@/components/User/Vehicles/crud-box'
// utils
import Role from '@/enums/role'
import UserCard from '@/app/(auth)/systems/users/[uuid]/_parts/user-card'
// hooks
import { isUserHasRole } from '@/hooks/use-is-auth-has-role'
import useUserDetailSwr from '@/modules/user/hooks/use-user-detail-swr'
import LoadingCenter from '@/components/loading-center'
import BackButton from '@/components/back-button'
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
                    <UserCard />
                </FormDataProvider>

                <UserDetailCrud />

                <Masonry
                    sx={{
                        m: 0,
                    }}
                    columns={{
                        md: 2,
                        sm: 1,
                        xs: 1,
                    }}
                    spacing={2}>
                    <Card>
                        <CardContent>
                            <UserSocialsCrudBox
                                userUuid={uuid}
                                data={socials}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <UserAddressesCrudBox
                                userUuid={uuid}
                                data={addresses}
                                isLoading={isLoading}
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent>
                            <UserBankAccsCrudBox />
                        </CardContent>
                    </Card>

                    <Fade
                        in={isUserHasRole(Role.EMPLOYEE, userWithDetails)}
                        unmountOnExit
                        exit={false}>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('karyawan')}
                                title="Kepegawaian"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserEmployeeCrud
                                    userUuid={uuid}
                                    data={employee}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        in={isUserHasRole(Role.MEMBER, userWithDetails)}
                        unmountOnExit
                        exit={false}>
                        <div>
                            <UserMemberCrudCard />
                        </div>
                    </Fade>

                    <Fade
                        in={isUserHasRole(Role.FARMER, userWithDetails)}
                        unmountOnExit
                        exit={false}>
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
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit
                        exit={false}>
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
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit
                        exit={false}>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('pengangkut')}
                                title="Daftar Kendaraan Pengangkut"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserVehiclesCrudBox
                                    data={vehicles}
                                    courierUserUuid={uuid}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade
                        in={isUserHasRole(Role.DRIVER, userWithDetails)}
                        unmountOnExit
                        exit={false}>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('pengemudi')}
                                title="Informasi Pengemudi"
                                titleTypographyProps={TITLE_TYPOGRAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <Typography variant="caption" color="GrayText">
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
    variant: 'body1',
    fontWeight: 'bold',
}

const PT_0_SX = { pt: 0 }
