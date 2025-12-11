'use client'

import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import FormHelperText from '@mui/material/FormHelperText'
import Typography from '@mui/material/Typography'
import { Field, type FieldProps } from 'formik'
import TextField from '@/components/formik-fields/text-field'

export default function FormFields() {
    return (
        <>
            <Field name="priority">
                {({
                    field: { value },
                    form: { setFieldValue, isSubmitting },
                    meta: { error },
                }: FieldProps<string>) => (
                    <>
                        <Typography color="text.secondary" mb={1} mt={2}>
                            Prioritas*
                        </Typography>

                        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            <Chip
                                color={value === 'low' ? 'info' : 'default'}
                                disabled={isSubmitting}
                                label="Rendah"
                                onClick={() => setFieldValue('priority', 'low')}
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight:
                                        value === 'low' ? 'bold' : 'normal',
                                }}
                                variant={
                                    value === 'low' ? 'filled' : 'outlined'
                                }
                            />
                            <Chip
                                color={
                                    value === 'medium' ? 'warning' : 'default'
                                }
                                disabled={isSubmitting}
                                label="Sedang"
                                onClick={() =>
                                    setFieldValue('priority', 'medium')
                                }
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight:
                                        value === 'medium' ? 'bold' : 'normal',
                                }}
                                variant={
                                    value === 'medium' ? 'filled' : 'outlined'
                                }
                            />
                            <Chip
                                color={value === 'high' ? 'error' : 'default'}
                                disabled={isSubmitting}
                                label="Tinggi"
                                onClick={() =>
                                    setFieldValue('priority', 'high')
                                }
                                sx={{
                                    cursor: 'pointer',
                                    fontWeight:
                                        value === 'high' ? 'bold' : 'normal',
                                }}
                                variant={
                                    value === 'high' ? 'filled' : 'outlined'
                                }
                            />
                        </Box>

                        {error && (
                            <FormHelperText error sx={{ ml: 0 }}>
                                {error}
                            </FormHelperText>
                        )}
                    </>
                )}
            </Field>

            <TextField label="Judul" name="title" />

            <TextField
                label="Pesan"
                name="message"
                textFieldProps={{
                    multiline: true,
                    rows: 4,
                }}
            />
        </>
    )
}
