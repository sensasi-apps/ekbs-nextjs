// materials
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// icons
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import ForestIcon from '@mui/icons-material/Forest'
import GroupsIcon from '@mui/icons-material/Groups'
import HomeIcon from '@mui/icons-material/Home'
import EditNoteIcon from '@mui/icons-material/EditNote'
// components
import ChipSmall from '@/components/ChipSmall'
// modules
import type Land from '@/modules/clm/types/orms/land'
// utils
import shortUuid from '@/utils/short-uuid'
import toDmy from '@/utils/to-dmy'
import FlexBox from '@/components/flex-box'

export default function LandCard({ land }: { land: Land }) {
    return (
        <Card>
            <CardActionArea>
                <CardContent sx={{ p: 3 }}>
                    <FlexBox mb={1} justifyContent="space-between">
                        <ChipSmall
                            label={shortUuid(land.uuid)}
                            color="info"
                            variant="outlined"
                        />

                        <ChipSmall
                            label={
                                (land.requisite_lands_with_default?.filter(
                                    requisiteLand =>
                                        requisiteLand.approved_by_user_uuid,
                                ).length ?? 0) +
                                '/' +
                                land.requisite_lands?.length
                            }
                            color="error"
                            variant="outlined"
                        />
                    </FlexBox>

                    <FlexBox mb={2}>
                        <ForestIcon />

                        <Typography
                            variant="h4"
                            fontWeight="bold"
                            component="div">
                            {land.n_area_hectares} Ha
                        </Typography>
                    </FlexBox>

                    <Info
                        Icon={CalendarTodayIcon}
                        text={toDmy(land.planted_at)}
                    />

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
