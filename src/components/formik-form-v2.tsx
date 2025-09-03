import type { ReactNode } from 'react'
import { Form, useFormikContext } from 'formik'
// materials
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import LinearProgress from '@mui/material/LinearProgress'
//
import FlexBox from '@/components/flex-box'

export default function FormikForm({ children }: { children: ReactNode }) {
    return (
        <>
            <Form autoComplete="off">
                {children}

                <LoadingIndicator />

                <FlexBox mt={1} justifyContent="end">
                    <ResetButton />
                    <SubmitButton />
                </FlexBox>
            </Form>
        </>
    )
}

function LoadingIndicator() {
    const { isSubmitting } = useFormikContext()

    return (
        <Fade in={isSubmitting}>
            <LinearProgress
                sx={{
                    mt: 3,
                }}
                color="success"
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
            variant="contained"
            color="success"
            loading={isSubmitting}
            type="submit">
            Simpan
        </Button>
    )
}
