import TextField from '@/components/formik-fields/text-field'

export default function FormFields() {
    return (
        <>
            <TextField label="Nama" name="name" />
            <TextField
                label="Deskripsi"
                name="description"
                textFieldProps={{
                    multiline: true,
                    rows: 3,
                }}
            />
        </>
    )
}
