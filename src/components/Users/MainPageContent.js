import { useRouter } from 'next/router/'

import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Fade from '@mui/material/Fade'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

import Masonry from '@mui/lab/Masonry'

import UserCrud from '../User/Crud'
import UsersSummaryBox from '@/components/Users/SummaryBox'
import UserSelect from '@/components/User/Select'
import UserDetailCrud from '../User/Detail/Crud'
import UserBankAccsCrudBox from '../User/BankAccs/CrudBox'
import UserAddressesCrudBox from '../User/Address/CrudBox'
import UserSocialsCrudBox from '../User/Socials/CrudBox'
import UserEmployeeCrud from '../User/Employee/Crud'

import useUserWithDetails, {
    UserWithDetailsProvider,
} from '@/providers/UserWithDetails'
import UserMemberCrudCard from '../User/Member/CrudCard'
import { getRoleIconByIdName } from '../User/RoleChips'
import UserDriversCrudBox from '../User/Drivers/CrudBox'
import UserVehiclesCrudBox from '../User/Vehicles/CrudBox'
import UserLandsCrud from '../User/Lands/Crud'

const GRID_CONTAINER_SX = {
    flexDirection: {
        xs: 'column-reverse',
        sm: 'column-reverse',
        md: 'row',
    },
}

const TITLE_TYPORAPHY_PROPS = {
    variant: 'body1',
    fontWeight: 'bold',
}

const PT_0_SX = { pt: 0 }

const Component = () => {
    const router = useRouter()

    const {
        data: userWithDetails = {},
        error,
        isReady,
        isLoading,
    } = useUserWithDetails()

    if (error?.response?.status === 404) {
        router.replace('/users')
    }

    // ########## NON HOOKS ##########

    const {
        addresses,
        uuid,
        socials,
        employee,
        member,
        driver,

        lands,
        drivers,
        vehicles,

        hasRoleId = () => undefined,
    } = userWithDetails

    const isShowEmployeeCard =
        isReady && Boolean(employee || userHasRole('karyawan', userWithDetails))
    const isShowMemberCard = isReady && Boolean(member || hasRoleId('anggota'))
    const isShowDriverCard =
        isReady && Boolean(driver || userHasRole('pengemudi', userWithDetails))
    const isShowDriversCard =
        isReady &&
        (drivers?.length > 0 || userHasRole('pengangkut', userWithDetails))
    const isShowLandsCard =
        isReady && (lands?.length > 0 || userHasRole('petani', userWithDetails))
    const isShowVehiclesCard =
        isReady &&
        (vehicles?.length > 0 || userHasRole('pengangkut', userWithDetails))

    const userSelectOnChange = (e, value) => {
        if (!value) return router.push('/users')

        return router.push(`/users/${value.uuid}`)
    }

    return (
        <Grid container spacing={3} sx={GRID_CONTAINER_SX}>
            <Grid
                item
                sm={12}
                md={8}
                display="flex"
                flexDirection="column"
                gap={3}>
                <UserSelect onChange={userSelectOnChange} />

                <Fade in={isReady} exit={false}>
                    <UserCrud />
                </Fade>

                <Fade in={isReady} unmountOnExit exit={false}>
                    <UserDetailCrud />
                </Fade>

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
                    <Fade in={isReady} exit={false}>
                        <Card>
                            <CardContent>
                                <UserSocialsCrudBox
                                    userUuid={uuid}
                                    data={socials}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade in={isReady} unmountOnExit exit={false}>
                        <Card>
                            <CardContent>
                                <UserAddressesCrudBox
                                    userUuid={uuid}
                                    data={addresses}
                                    isLoading={isLoading}
                                />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade in={isReady} unmountOnExit exit={false}>
                        <Card>
                            <CardContent>
                                <UserBankAccsCrudBox />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade in={isShowEmployeeCard} unmountOnExit exit={false}>
                        <Card>
                            <CardHeader
                                avatar={getRoleIconByIdName('karyawan')}
                                title="Kepegawaian"
                                titleTypographyProps={TITLE_TYPORAPHY_PROPS}
                            />
                            <CardContent sx={PT_0_SX}>
                                <UserEmployeeCrud />
                            </CardContent>
                        </Card>
                    </Fade>

                    <Fade in={isShowMemberCard} unmountOnExit exit={false}>
                        <UserMemberCrudCard />
                    </Fade>

                    <Fade in={isShowLandsCard} unmountOnExit exit={false}>
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

                    <Fade in={isShowDriversCard} unmountOnExit exit={false}>
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

                    <Fade in={isShowVehiclesCard} unmountOnExit exit={false}>
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

                    <Fade in={isShowDriverCard} unmountOnExit exit={false}>
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
                                <Typography>
                                    {driver?.license_number}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Fade>
                </Masonry>
            </Grid>

            <Grid item sm={12} md={4} width="100%">
                <UsersSummaryBox />
            </Grid>
        </Grid>
    )
}

const UsersMainPageContent = () => (
    <UserWithDetailsProvider>
        <Component />
    </UserWithDetailsProvider>
)

export default UsersMainPageContent
