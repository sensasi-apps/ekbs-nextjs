// types
import type { FormikFormProps } from 'formik'
import type { LoadingButtonProps } from '@mui/lab/LoadingButton'
// vendors
import { memo } from 'react'
import { Form } from 'formik'
import Box from '@mui/material/Box'
// components
import DialogLoadingBar from '@/components/Dialog/LoadingBar'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'
import FormDeleteButton from '../form/FormDeleteButton'

/**
 * A memoized component that renders a Formik form with additional buttons and features.
 * @param id - The unique identifier for the form.
 * @param autoComplete - 'off'.
 * @param isNew - A boolean indicating whether the form is new or not.
 * @param dirty - A boolean indicating whether the form has been modified.
 * @param submitting - A boolean indicating whether the form is currently submitting.
 * @param processing - A boolean indicating whether the form is currently processing.
 * @param slotProps - An object containing the props for the submit and delete buttons.
 * @param children - The child components to be rendered within the form.
 * @returns A memoized component that renders a Formik form with additional buttons and features.
 */
const FormikForm = memo(function FormikForm({
    id: formId,
    autoComplete = 'off',
    isNew,
    children,
    processing,
    dirty,
    submitting,
    slotProps: {
        deleteButton: deleteButtonProps,
        cancelButton: cancelButtonProps,
        submitButton: submitButtonProps,
        loadingBar: loadingBarProps,
    },
    ...props
}: {
    id: string
    autoComplete?: 'on' | 'off'
    isNew: boolean
    dirty: boolean
    submitting: boolean
    processing: boolean
    slotProps: {
        deleteButton?: LoadingButtonProps
        cancelButton?: Omit<LoadingButtonProps, 'disabled' | 'form' | 'type'>
        submitButton: {
            disabled: boolean
            confirmationText?: string
        }
        loadingBar?: Parameters<typeof DialogLoadingBar>[0]
    }
} & Omit<FormikFormProps, 'id'>) {
    return (
        <>
            <DialogLoadingBar in={processing} {...loadingBarProps} />
            <Form id={formId} autoComplete={autoComplete} {...props}>
                {children}

                <Box display="flex" mt="1em" justifyContent="space-between">
                    <Box>
                        {deleteButtonProps?.onClick && (
                            <FormDeleteButton {...deleteButtonProps} />
                        )}
                    </Box>

                    <Box display="flex" gap={1}>
                        <FormResetButton
                            dirty={dirty}
                            disabled={processing}
                            form={formId}
                            slotProps={{
                                button: cancelButtonProps,
                            }}
                        />

                        <FormSubmitButton
                            loading={submitting}
                            form={formId}
                            disabled={!dirty || submitButtonProps.disabled}
                            oldDirty={dirty && !isNew}
                            confirmationText={
                                submitButtonProps.confirmationText
                            }
                        />
                    </Box>
                </Box>
            </Form>
        </>
    )
})

export default FormikForm
