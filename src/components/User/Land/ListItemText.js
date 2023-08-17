import NumericMasking from '@/components/Inputs/NumericMasking'
import ListItemText from '@mui/material/ListItemText'
import moment from 'moment'

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
        planted_at ? moment(planted_at).format('YYYY') : undefined,
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

const UserLandListItemText = ({ data: land = {} }) => {
    const { n_area_hectares } = land
    return (
        <ListItemText
            primary={
                <NumericMasking
                    displayType="text"
                    value={n_area_hectares}
                    suffix=" Ha"
                />
            }
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

export default UserLandListItemText
