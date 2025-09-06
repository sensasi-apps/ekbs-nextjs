'use client'

// vendors
import type { UUID } from 'crypto'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
// icons
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
// components
import BackButton from '@/components/back-button'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
// utils
import shortUuid from '@/utils/short-uuid'
import toDmy from '@/utils/to-dmy'
// modules
import type LandORM from '@/modules/clm/types/orms/land'
import RequisiteLandCard from '@/modules/clm/components/user-or-land-requisite-card'

export default function Page() {
    const { user_uuid, land_uuid } = useParams()

    const { data } = useSWR<LandORM>(
        `/clm/members/${user_uuid}/lands/${land_uuid}`,
    )

    if (!data) return <LoadingCenter />

    return (
        <>
            <BackButton />
            <PageTitle title={`Lahan ${shortUuid(land_uuid as UUID)}`} />

            <Info Icon={EditNoteIcon} text={data.note} />

            <Box mt={2}>
                <table>
                    <tbody>
                        <tr>
                            <td>Pemilik</td>
                            <td> :</td>
                            <td>{data.member?.user?.name}</td>
                        </tr>

                        <tr>
                            <td>Luas</td>
                            <td> :</td>
                            <td>{data.n_area_hectares} HA</td>
                        </tr>

                        <tr>
                            <td>TGL. Tanam</td>
                            <td> :</td>
                            <td>
                                {data.planted_at ? toDmy(data.planted_at) : '-'}
                            </td>
                        </tr>

                        <tr>
                            <td>LAND ID (REA)</td>
                            <td> :</td>
                            <td>{data.rea_land_id}</td>
                        </tr>

                        <tr>
                            <td>Kelompok Tani</td>
                            <td> :</td>
                            <td>{data.farmer_group?.name}</td>
                        </tr>

                        {/* <tr>
                            <td>Alamat</td>
                            <td> :</td>
                            <td>
                                {data.address.detail}
                                <div>
                                    {data.address.region.id}{' '}
                                    {data.address.region.name}
                                </div>
                            </td>
                        </tr> */}
                    </tbody>
                </table>
            </Box>

            <Button
                size="small"
                variant="outlined"
                endIcon={<EditIcon />}
                href={`${land_uuid}/edit`}>
                Perbarui data
            </Button>

            <Typography mt={6} mb={1} fontWeight="bold">
                Persyaratan:
            </Typography>

            {data?.requisite_lands_with_default?.map(requisiteLand => (
                <RequisiteLandCard
                    key={requisiteLand.requisite_id}
                    data={requisiteLand}
                />
            ))}
        </>
    )
}

function Info({ Icon, text }: { Icon: typeof EditNoteIcon; text?: string }) {
    if (!text) return null

    return (
        <Typography
            variant="body2"
            component="div"
            display="flex"
            gap={1}
            alignItems="middle"
            color="textDisabled">
            <Icon fontSize="small" />
            {text}
        </Typography>
    )
}
