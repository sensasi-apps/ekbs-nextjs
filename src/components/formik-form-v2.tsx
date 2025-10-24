// materials
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
import { Form, useFormikContext } from 'formik'
import type { ReactNode } from 'react'
//
import FlexBox from '@/components/flex-box'

export default function FormikForm({ children }: { children: ReactNode }) {
    return (
        <Form autoComplete="off">
            {children}

            <LoadingIndicator />

            <FlexBox justifyContent="end" mt={1}>
                <ResetButton />
                <SubmitButton />
            </FlexBox>
        </Form>
    )
}

function LoadingIndicator() {
    const { isSubmitting } = useFormikContext()

    return (
        <Fade in={isSubmitting}>
            <LinearProgress
                color="success"
                sx={{
                    mt: 3,
                }}
            />
        </Fade>
    )
}

function ResetButton() {
    const { isSubmitting } = useFormikContext()

    return (
        <Button color="success" loading={isSubmitting} type="reset">
            Batal
        </Button>
    )
}

function SubmitButton() {
    const { isSubmitting } = useFormikContext()

    return (
        <Button
            color="success"
            loading={isSubmitting}
            type="submit"
            variant="contained">
            Simpan
        </Button>
    )
}
