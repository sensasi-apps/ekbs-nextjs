// materials
import Button from '@mui/material/Button'
import LinearProgress from '@mui/material/LinearProgress'
import { Form, useFormikContext } from 'formik'
// vendors
import { Activity, type ReactNode } from 'react'
// components
import FlexBox from '@/components/flex-box'

export default function FormikForm({ children }: { children: ReactNode }) {
    return (
        <>
            <LoadingIndicator />

            <Form autoComplete="off">
                {children}

                <FlexBox justifyContent="end" mt={1}>
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
        <Activity mode={isSubmitting ? 'visible' : 'hidden'}>
            <LinearProgress
                color="success"
                sx={theme => ({
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 0,
                    zIndex: theme.zIndex.appBar + 1,
                })}
            />
        </Activity>
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
