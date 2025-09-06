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
import SearchIcon from '@mui/icons-material/Search'
import DescriptionIcon from '@mui/icons-material/Description'
import ImageIcon from '@mui/icons-material/Image'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf'
//
import type FileORM from '@/types/orms/file'
import FileListDeleteButton from './file-list.delete-button'
import FileListPrimaryItemText from './file-list.primary-item-text'

export default function FileList({
    files,
    showDeleteButton = false,
    showEditNameButton = false,
}: {
    files: FileORM[]
    showDeleteButton?: boolean
    showEditNameButton?: boolean
}) {
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
                                <Tooltip title="Lihat">
                                    <IconButton
                                        edge="end"
                                        aria-label="lihat"
                                        href={
                                            '/files/' +
                                            file.uuid +
                                            '.' +
                                            file.extension
                                        }
                                        target="_blank">
                                        <SearchIcon />
                                    </IconButton>
                                </Tooltip>

                                {showDeleteButton && (
                                    <FileListDeleteButton
                                        uuidFileName={
                                            file.uuid + '.' + file.extension
                                        }
                                    />
                                )}
                            </Box>
                        }>
                        <ListItemIcon>{getIcon(file.mime)}</ListItemIcon>

                        <ListItemText
                            primary={
                                showEditNameButton ? (
                                    <FileListPrimaryItemText
                                        fileNameUuid={
                                            file.uuid + '.' + file.extension
                                        }
                                        text={file.alias}
                                    />
                                ) : (
                                    file.alias
                                )
                            }
                            secondary={
                                <Typography
                                    variant="caption"
                                    color="textSecondary">
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

function getIcon(mime: string) {
    switch (mime) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/webp':
            return <ImageIcon />

        case 'application/pdf':
            return <PictureAsPdfIcon />

        default:
            return <DescriptionIcon />
    }
}
