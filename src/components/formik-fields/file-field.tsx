import { Field, type FieldProps } from 'formik'
// materials
import { styled } from '@mui/material/styles'
import Fab, { type FabProps } from '@mui/material/Fab'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
// icons
import AddIcon from '@mui/icons-material/Add'
import PauseIcon from '@mui/icons-material/Pause'

interface FileFieldProps {
    name: string
    disabled?: boolean
    multiple?: boolean
    slotProps?: {
        button?: FabProps
    }
}

/**
 * ⚠️ Do not forget to add `'Content-Type': 'multipart/form-data'` to the request.
 */
export default function FileField(props: FileFieldProps) {
    return <Field component={InnerComponent} {...props} />
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

function InnerComponent({
    field: { name },
    form: { setFieldValue, getFieldMeta },
    slotProps,
    multiple,
}: Omit<FieldProps<File[]>, 'meta'> & Omit<FileFieldProps, 'name'>) {
    const { error, value } = getFieldMeta<File[]>(name)

    return (
        <>
            <div>
                <Fab
                    variant="extended"
                    color="primary"
                    component="label"
                    role={undefined}
                    {...slotProps?.button}>
                    <VisuallyHiddenInput
                        type="file"
                        id={name}
                        name={name}
                        onChange={({ currentTarget: { files } }) => {
                            setFieldValue(name, Array.from(files ?? []))
                        }}
                        multiple={multiple ?? false}
                    />
                    <AddIcon sx={{ mr: 1 }} />
                    Tambah Berkas
                </Fab>
            </div>

            {error && <FormHelperText error>{error}</FormHelperText>}

            {value.length > 0 && (
                <>
                    <Typography variant="caption" component="div">
                        Akan diunggah:
                    </Typography>

                    <List
                        dense
                        disablePadding
                        sx={{
                            px: 2,
                        }}>
                        {value.map(file => (
                            <ListItem key={file.name} disablePadding>
                                <ListItemIcon>
                                    <PauseIcon />
                                </ListItemIcon>

                                <ListItemText primary={file.name} />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </>
    )
}
