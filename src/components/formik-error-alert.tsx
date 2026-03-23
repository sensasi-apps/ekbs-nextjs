import Alert from '@mui/material/Alert'
import List from '@mui/material/List'
import { useFormikContext } from 'formik'

export default function FormikErrorAlert() {
    const { errors } = useFormikContext<FormData>()

    const formattedErrors: string[] = Object.entries(errors).reduce(
        (acc, [key, value]) => {
            if (value) {
                acc.push(`${key}: ${value}`)
            }
            return acc
        },
        [] as string[],
    )

    if (formattedErrors.length === 0) return null

    return (
        <Alert severity="error">
            <List disablePadding>
                {formattedErrors.map(error => (
                    <li key={error.replaceAll(' ', '-')}>{error}</li>
                ))}
            </List>
        </Alert>
    )
}
