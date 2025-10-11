// icons
import AddIcon from '@mui/icons-material/Add'
import PauseIcon from '@mui/icons-material/Pause'
import Fab, { type FabProps } from '@mui/material/Fab'
import FormHelperText from '@mui/material/FormHelperText'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
// materials
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import { Field, type FieldProps } from 'formik'

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
    bottom: 0,
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    left: 0,
    overflow: 'hidden',
    position: 'absolute',
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
                    color="primary"
                    component="label"
                    role={undefined}
                    variant="extended"
                    {...slotProps?.button}>
                    <VisuallyHiddenInput
                        id={name}
                        multiple={multiple ?? false}
                        name={name}
                        onChange={({ currentTarget: { files } }) => {
                            setFieldValue(name, Array.from(files ?? []))
                        }}
                        type="file"
                    />
                    <AddIcon sx={{ mr: 1 }} />
                    Tambah Berkas
                </Fab>
            </div>

            {error && <FormHelperText error>{error}</FormHelperText>}

            {value.length > 0 && (
                <>
                    <Typography component="div" variant="caption">
                        Akan diunggah:
                    </Typography>

                    <List
                        dense
                        disablePadding
                        sx={{
                            px: 2,
                        }}>
                        {value.map(file => (
                            <ListItem disablePadding key={file.name}>
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
