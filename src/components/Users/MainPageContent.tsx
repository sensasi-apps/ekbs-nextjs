// vendors
import { useRouter } from 'next/router'
// materials
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardHeaderProps,
    Fade,
    Typography,
} from '@mui/material'
// mui labs
import Masonry from '@mui/lab/Masonry'
// page components
import { getRoleIconByIdName } from '@/components/User/RoleChips'
import { UserDetailCrud } from '@/components/User/Detail/Crud'
import UserAddressesCrudBox from '@/components/User/Address/CrudBox'
import UserBankAccsCrudBox from '@/components/User/BankAccs/CrudBox'
import UserDriversCrudBox from '@/components/User/Drivers/CrudBox'
import UserEmployeeCrud from '@/components/User/Employee/Crud'
import UserLandsCrud from '@/components/User/Lands/Crud'
import UserMemberCrudCard from '@/components/User/Member/CrudCard'
import UserSocialsCrudBox from '@/components/User/Socials/CrudBox'
import UserVehiclesCrudBox from '@/components/User/Vehicles/CrudBox'
// utils
import useUserWithDetails from '@/providers/UserWithDetails'
import useAuth from '@/providers/Auth'
import Role from '@/enums/Role'
import UserCard from '../User/Card'

export default function UsersMainPageContent() {
    const { replace, query } = useRouter()
    const { userHasRole } = useAuth()

    const {
        data: userWithDetails = {},
        error,
        isLoading,
    } = useUserWithDetails()

    if (error?.response?.status === 404) {
        replace({
            pathname: '/users',
            query: { role: query.role },
        })
    }

    const {
        addresses,
        uuid,
        socials,
        employee,
        // member,
        driver,

        // lands,
        drivers,
        vehicles,
    } = userWithDetails

    return (
        <Box display="flex" flexDirection="column" gap={3}>
            <UserCard />

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
                    in={userHasRole(Role.EMPLOYEE, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <Card>
                        <CardHeader
                            avatar={getRoleIconByIdName('karyawan')}
                            title="Kepegawaian"
                            titleTypographyProps={TITLE_TYPORAPHY_PROPS}
                        />
                        <CardContent sx={PT_0_SX}>
                            <UserEmployeeCrud userUuid={uuid} data={employee} />
                        </CardContent>
                    </Card>
                </Fade>

                <Fade
                    in={userHasRole(Role.MEMBER, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <UserMemberCrudCard />
                </Fade>

                <Fade
                    in={userHasRole(Role.FARMER, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <Card>
                        <CardHeader
                            avatar={getRoleIconByIdName('petani')}
                            title="Daftar Kebun"
                            titleTypographyProps={TITLE_TYPORAPHY_PROPS}
                        />
                        <CardContent sx={PT_0_SX}>
                            <UserLandsCrud />
                        </CardContent>
                    </Card>
                </Fade>

                <Fade
                    in={userHasRole(Role.DRIVER, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <Card>
                        <CardHeader
                            avatar={getRoleIconByIdName('pengangkut')}
                            title="Daftar Pengemudi"
                            titleTypographyProps={TITLE_TYPORAPHY_PROPS}
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
                    in={userHasRole(Role.DRIVER, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <Card>
                        <CardHeader
                            avatar={getRoleIconByIdName('pengangkut')}
                            title="Daftar Kendaraan Pengangkut"
                            titleTypographyProps={TITLE_TYPORAPHY_PROPS}
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
                    in={userHasRole(Role.DRIVER, userWithDetails)}
                    unmountOnExit
                    exit={false}>
                    <Card>
                        <CardHeader
                            avatar={getRoleIconByIdName('pengemudi')}
                            title="Informasi Pengemudi"
                            titleTypographyProps={TITLE_TYPORAPHY_PROPS}
                        />
                        <CardContent sx={PT_0_SX}>
                            <Typography variant="caption" color="GrayText">
                                No. SIM:
                            </Typography>
                            <Typography>{driver?.license_number}</Typography>
                        </CardContent>
                    </Card>
                </Fade>
            </Masonry>
        </Box>
    )
}

const TITLE_TYPORAPHY_PROPS: CardHeaderProps['titleTypographyProps'] = {
    variant: 'body1',
    fontWeight: 'bold',
}

const PT_0_SX = { pt: 0 }
