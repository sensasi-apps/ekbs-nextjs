import { useFormikContext } from 'formik'
import Button, { type ButtonProps } from '@mui/material/Button'

export default function ResetButton(props: ButtonProps) {
    const { isSubmitting } = useFormikContext()

    return (
        <Button color="success" loading={isSubmitting} type="reset" {...props}>
            Batal
        </Button>
    )
}
