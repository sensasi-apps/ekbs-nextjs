// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
// icons
import ForestIcon from '@mui/icons-material/Forest'
import GroupsIcon from '@mui/icons-material/Groups'
// components
import type Land from '@/types/Land'
import ChipSmall from '@/components/ChipSmall'
// utils
import shortUuid from '@/utils/short-uuid'

export default function LandCard({ land }: { land: Land }) {
    return (
        <Card>
            <CardActionArea>
                <CardContent sx={{ p: 3 }}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between">
                        <Box display="flex" alignItems="center" gap={1.5}>
                            <ForestIcon />

                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                component="div">
                                {land.n_area_hectares} Ha
                            </Typography>

                            <ChipSmall
                                label={shortUuid(land.uuid)}
                                color="info"
                                variant="outlined"
                            />
                        </Box>

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
                    </Box>

                    <Typography variant="caption" component="div" color="gray">
                        {land.uuid}
                    </Typography>

                    {land.farmer_group && (
                        <Box
                            display="flex"
                            gap={1}
                            alignItems="center"
                            sx={{
                                opacity: 0.7,
                            }}>
                            <GroupsIcon color="warning" />

                            <Typography component="div" color="warning">
                                {land.farmer_group.name}
                            </Typography>
                        </Box>
                    )}

                    {land.note && (
                        <Typography variant="body2" component="div">
                            {land.note}
                        </Typography>
                    )}

                    {land.address.detail && (
                        <Typography variant="body2" component="div">
                            {land.address.detail}
                        </Typography>
                    )}
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
