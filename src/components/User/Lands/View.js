import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'

import UserLandListItemText from '../Land/ListItemText'
import useFormData from '@/providers/useFormData2'

const LandsView = ({ data: lands }) => {
    const { handleEdit } = useFormData()

    if (!lands || !lands.length) {
        return (
            <Typography>
                <i>Belum ada data kebun</i>
            </Typography>
        )
    }

    return (
        <List disablePadding>
            {lands.map(land => (
                <ListItem key={land.uuid} disablePadding>
                    <ListItemButton onClick={() => handleEdit(land)}>
                        <UserLandListItemText data={land} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default LandsView
