import { useFormikContext } from 'formik'
import Button, { type ButtonProps } from '@mui/material/Button'

export default function SubmitButton(props: ButtonProps) {
    const { isSubmitting } = useFormikContext()

    return (
        <Button
            variant="contained"
            color="success"
            loading={isSubmitting}
            type="submit"
            {...props}>
            Simpan
        </Button>
    )
}
