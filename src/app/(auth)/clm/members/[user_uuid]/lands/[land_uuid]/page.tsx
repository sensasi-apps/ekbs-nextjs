'use client'

// vendors
import type { UUID } from 'node:crypto'
// icons
import EditIcon from '@mui/icons-material/Edit'
import EditNoteIcon from '@mui/icons-material/EditNote'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
// components
import BackButton from '@/components/back-button'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import RequisiteLandCard from '@/modules/clm/components/user-or-land-requisite-card'
// modules
import type LandORM from '@/modules/clm/types/orms/land'
// utils
import shortUuid from '@/utils/short-uuid'
import toDmy from '@/utils/to-dmy'

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
                endIcon={<EditIcon />}
                href={`${land_uuid}/edit`}
                size="small"
                variant="outlined">
                Perbarui data
            </Button>

            <Typography fontWeight="bold" mb={1} mt={6}>
                Persyaratan:
            </Typography>

            {data?.requisite_lands_with_default?.map(requisiteLand => (
                <RequisiteLandCard
                    data={requisiteLand}
                    key={requisiteLand.requisite_id}
                />
            ))}
        </>
    )
}

function Info({ Icon, text }: { Icon: typeof EditNoteIcon; text?: string }) {
    if (!text) return null

    return (
        <Typography
            alignItems="middle"
            color="textDisabled"
            component="div"
            display="flex"
            gap={1}
            variant="body2">
            <Icon fontSize="small" />
            {text}
        </Typography>
    )
}
