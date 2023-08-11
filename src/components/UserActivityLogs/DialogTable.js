import PropTypes from 'prop-types'

import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'

import CloseIcon from '@mui/icons-material/Close'

import UserActivityLogsTable from './Table'

const UserActivityLogsDialogTable = ({ open, data, setIsOpen }) => {
    return (
        <Dialog open={open}>
            <DialogTitle
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                fontWeight="bold"
                typography={false}
                component="div">
                Detail Log
                <IconButton onClick={() => setIsOpen(false)}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <UserActivityLogsTable data={data} />
            </DialogContent>
        </Dialog>
    )
}

UserActivityLogsDialogTable.propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.array,
}

export default UserActivityLogsDialogTable
