// vendors
import dayjs from 'dayjs'
import ListItemText from '@mui/material/ListItemText'
// utils
import formatNumber from '@/utils/format-number'

export default function UserLandListItemText({ data: land = {} }) {
    const { n_area_hectares } = land
    return (
        <ListItemText
            primary={formatNumber(n_area_hectares) + ' Ha'}
            primaryTypographyProps={{
                variant: 'h6',
                fontWeight: 'bold',
            }}
            secondary={toSecondaryText(land)}
            secondaryTypographyProps={{
                variant: 'body2',
                color: 'GrayText',
            }}
        />
    )
}

const toSecondaryText = ({
    farmer_group,
    address: { province, regency, district, village, detail, zip_code } = {},
    rea_land_id,
    planted_at,
    note,
}) =>
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
