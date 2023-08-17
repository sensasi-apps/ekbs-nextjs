import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import Typography from '@mui/material/Typography'

// import DeleteIcon from '@mui/icons-material/Delete'
import UserLandListItemText from '../Land/ListItemText'
import useData from '@/providers/useData'

const LandsView = ({ data: lands }) => {
    const { handleEdit } = useData()

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
