import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
// icons
import EditIcon from '@mui/icons-material/Edit'
// materials
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useState } from 'react'
import myAxios from '@/lib/axios'
import FlexBox from './flex-box'
//
import TextField from './TextField'

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
        myAxios.post(`/file/${fileNameUuid}/rename`, {
            name: editedText,
        })
    }

    if (!isEdit)
        return (
            <>
                {editedText}

                <Tooltip title="Ubah nama">
                    <IconButton
                        aria-label="ubah nama"
                        edge="end"
                        onClick={toggleEdit}
                        size="small"
                        sx={{
                            ml: 1,
                        }}>
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </>
        )

    return (
        <FlexBox>
            <TextField
                fullWidth={false}
                margin="none"
                onChange={e => setEditedText(e.target.value)}
                sx={{
                    width: '50%',
                }}
                value={editedText}
            />

            <Tooltip title="Batal">
                <IconButton
                    aria-label="batal"
                    color="error"
                    edge="end"
                    onClick={toggleEdit}
                    size="small">
                    <CloseIcon />
                </IconButton>
            </Tooltip>

            <Tooltip title="Simpan">
                <IconButton
                    aria-label="simpan"
                    color="success"
                    edge="end"
                    onClick={handleSave}
                    size="small">
                    <CheckIcon />
                </IconButton>
            </Tooltip>
        </FlexBox>
    )
}
