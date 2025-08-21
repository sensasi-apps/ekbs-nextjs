import myAxios from '@/lib/axios'
import { useState } from 'react'

// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
// icons
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import CheckIcon from '@mui/icons-material/Check'
//
import TextField from './TextField'
import FlexBox from './flex-box'

export default function FileListPrimaryItemText({
    fileNameUuid,
    text,
}: {
    fileNameUuid: string
    text: string
}) {
    const [isEdit, setIsEdit] = useState(false)
    const [editedText, setEditedText] = useState(text)

    function toggleEdit() {
        setIsEdit(prev => !prev)
    }

    function handleSave() {
        setIsEdit(false)

        if (editedText === text) return

        toggleEdit()
        myAxios.post('/file/' + fileNameUuid + '/rename', {
            name: editedText,
        })
    }

    if (!isEdit)
        return (
            <>
                {editedText}

                <Tooltip title="Ubah nama">
                    <IconButton
                        sx={{
                            ml: 1,
                        }}
                        edge="end"
                        size="small"
                        aria-label="ubah nama"
                        onClick={toggleEdit}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        )

    return (
        <FlexBox>
            <TextField
                margin="none"
                sx={{
                    width: '50%',
                }}
                fullWidth={false}
                value={editedText}
                onChange={e => setEditedText(e.target.value)}
            />

            <Tooltip title="Batal">
                <IconButton
                    edge="end"
                    size="small"
                    aria-label="batal"
                    color="error"
                    onClick={toggleEdit}>
                    <CloseIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Simpan">
                <IconButton
                    color="success"
                    edge="end"
                    size="small"
                    aria-label="simpan"
                    onClick={handleSave}>
                    <CheckIcon />
                </IconButton>
            </Tooltip>
        </FlexBox>
    )
}
