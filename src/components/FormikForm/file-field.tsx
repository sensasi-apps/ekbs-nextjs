import { styled } from '@mui/material/styles'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import PauseIcon from '@mui/icons-material/Pause'
import { Field, type FieldProps } from 'formik'
import FormHelperText from '@mui/material/FormHelperText'

interface FileFieldProps {
    // value?: string
    name: string
    disabled?: boolean
    // textFieldProps?: Omit<
    //     MuiTextFieldProps,
    //     'error' | 'name' | 'id' | 'disabled' | 'label' | 'value' | 'onChange'
    // >
}

/**
 *
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
    // formik props
    field: { name },
    form: { setFieldValue, getFieldMeta },

    // additional props
    // label,
    // disabled,
    // textFieldProps,
    // value: valueProp,
}: Omit<FieldProps<File[]>, 'meta'>) {
    const { error, value } = getFieldMeta<File[]>(name)

    return (
        <>
            {/* <DefaultTextField
                id={name}
                disabled={disabled || isSubmitting}
                label={label}
                value={innerValue}
                onChange={({ target: { value } }) => {
                    setInnerValue(value)
                    debounceSetFieldValue(value)
                }}
                {...textFieldProps}
                error={Boolean(error)}
                helperText={error ?? textFieldProps?.helperText}
            /> */}

            <Button
                fullWidth
                component="label"
                role={undefined}
                variant="outlined"
                startIcon={<AddIcon />}>
                Tambah Berkas
                <VisuallyHiddenInput
                    type="file"
                    id={name}
                    // disabled={disabled}
                    onChange={({ currentTarget: { files } }) => {
                        setFieldValue(name, Array.from(files ?? []))
                    }}
                    multiple
                />
            </Button>

            {error && <FormHelperText error>{error}</FormHelperText>}

            {value.length > 0 && (
                <>
                    <Typography variant="caption">Akan diunggah:</Typography>

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

                                <ListItemText
                                    primary={file.name}
                                    // secondary={secondary ? 'Secondary text' : null}
                                />
                            </ListItem>
                        ))}
                    </List>
                </>
            )}
        </>
    )
}
