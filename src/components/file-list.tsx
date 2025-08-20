// vendors
// import { useState } from 'react'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
// icons
import FilePresentIcon from '@mui/icons-material/FilePresent'
import DeleteIcon from '@mui/icons-material/Delete'
import DownloadIcon from '@mui/icons-material/Download'
// import ConfirmationDialog from './ConfirmationDialog'
//
import type File from '@/dataTypes/File'

export default function FileList({
    files,
    onDelete,
}: {
    files: File[]
    onDelete?: (file: File) => void
}) {
    // const [fileToBeDeleted, setFileToBeDeleted] = useState<File>()

    if (files.length === 0)
        return <Alert severity="warning">Belum ada berkas</Alert>

    return (
        <>
            <List dense>
                {files.map(file => (
                    <ListItem
                        key={file.uuid}
                        secondaryAction={
                            <Box display="flex" gap={1}>
                                <Tooltip title="Download">
                                    <IconButton
                                        edge="end"
                                        aria-label="download"
                                        href={file.uuid}
                                        target="_blank">
                                        <DownloadIcon />
                                    </IconButton>
                                </Tooltip>

                                {onDelete && (
                                    <Tooltip title="Delete">
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            // onClick={() =>
                                            //     setFileToBeDeleted(file)
                                            // }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>
                        }>
                        <ListItemIcon>
                            <FilePresentIcon />
                        </ListItemIcon>
                        <ListItemText
                            primary={file.alias}
                            secondary={
                                <Typography variant="caption">
                                    {file.mime}
                                </Typography>
                            }
                        />
                    </ListItem>
                ))}
            </List>
        </>
    )
}
