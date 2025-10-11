// vendors

import ListItemText from '@mui/material/ListItemText'
import dayjs from 'dayjs'
import type LandORM from '@/modules/clm/types/orms/land'
// utils
import formatNumber from '@/utils/format-number'

export default function UserLandListItem({ data: land }: { data: LandORM }) {
    const { n_area_hectares } = land

    return (
        <ListItemText
            primary={formatNumber(n_area_hectares) + ' Ha'}
            primaryTypographyProps={{
                fontWeight: 'bold',
                variant: 'h6',
            }}
            secondary={toSecondaryText(land)}
            secondaryTypographyProps={{
                color: 'GrayText',
                variant: 'body2',
            }}
        />
    )
}

const toSecondaryText = ({
    farmer_group,
    address: { province, regency, district, village, detail, zip_code },
    rea_land_id,
    planted_at,
    note,
}: LandORM) =>
    [
        note,
        rea_land_id,
        farmer_group?.name,
        planted_at ? dayjs(planted_at).format('YYYY') : undefined,
        [
            detail,
            province?.name,
            regency?.name,
            district?.name,
            village?.name,
            zip_code,
        ]
            .filter(Boolean)
            .join(', '),
    ]
        .filter(Boolean)
        .join(' • ')
