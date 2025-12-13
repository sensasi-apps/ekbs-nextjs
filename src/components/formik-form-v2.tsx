'use client'

// materials
import Button from '@mui/material/Button'
import { Form, useFormikContext } from 'formik'
// vendors
import { type ReactNode } from 'react'
// components
import FlexBox from '@/components/flex-box'
import TopLinearProgress from './top-linear-progress'

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

    return <TopLinearProgress show={isSubmitting} />
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
