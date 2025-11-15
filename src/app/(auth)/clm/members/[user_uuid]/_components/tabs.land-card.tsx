// materials

// icons
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EditNoteIcon from '@mui/icons-material/EditNote'
import ForestIcon from '@mui/icons-material/Forest'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useParams } from 'next/navigation'
// components
import ChipSmall from '@/components/chip-small'
import FlexBox from '@/components/flex-box'
import NextLink from '@/components/next-link'
// modules
import type Land from '@/modules/clm/types/orms/land'
// utils
import shortUuid from '@/utils/short-uuid'
import toDmy from '@/utils/to-dmy'

export default function LandCard({ land }: { land: Land }) {
    const { user_uuid } = useParams()
    const nApprovedRequisiteLands =
        land.requisite_lands_with_default?.filter(
            requisiteLand => requisiteLand.approved_by_user_uuid,
        ).length ?? 0

    const nRequisites = land.requisite_lands_with_default?.length ?? 0

    const nRequiredApprovedRequisiteLands =
        land.requisite_lands_with_default?.filter(
            requisiteLand =>
                requisiteLand.approved_by_user_uuid &&
                !requisiteLand.requisite?.is_optional,
        ).length ?? 0

    const nRequiredRequisites =
        land.requisite_lands_with_default?.filter(
            requisiteLand => !requisiteLand.requisite?.is_optional,
        ).length ?? 0

    const isAllFulfilled =
        nRequiredApprovedRequisiteLands >= nRequiredRequisites

    return (
        <Card
            sx={{
                borderColor: isAllFulfilled ? 'success.main' : undefined,
            }}
            variant={isAllFulfilled ? 'outlined' : 'elevation'}>
            <CardActionArea
                href={`${user_uuid}/lands/${land.uuid}`}
                LinkComponent={NextLink}>
                <CardContent sx={{ p: 3 }}>
                    <FlexBox justifyContent="space-between" mb={1}>
                        <ChipSmall
                            color="info"
                            label={shortUuid(land.uuid)}
                            variant="outlined"
                        />

                        <ChipSmall
                            color={isAllFulfilled ? 'success' : 'error'}
                            label={`${nApprovedRequisiteLands}/${nRequisites}`}
                            variant="outlined"
                        />
                    </FlexBox>

                    <FlexBox mb={2}>
                        <ForestIcon />

                        <Typography
                            component="div"
                            fontWeight="bold"
                            variant="h4">
                            {land.n_area_hectares} Ha
                        </Typography>
                    </FlexBox>

                    {land.planted_at && (
                        <Info
                            Icon={CalendarTodayIcon}
                            text={toDmy(land.planted_at)}
                        />
                    )}

                    <Info Icon={AssuredWorkloadIcon} text={land.rea_land_id} />

                    <Info Icon={GroupsIcon} text={land.farmer_group?.name} />

                    <Info
                        Icon={HomeIcon}
                        text={`${land.address.detail} (${land.address.region.name})`}
                    />

                    <Info Icon={EditNoteIcon} text={land.note} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

function Info({ Icon, text }: { Icon: typeof HomeIcon; text?: string }) {
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
