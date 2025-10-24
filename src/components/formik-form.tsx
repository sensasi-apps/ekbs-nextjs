// vendors

import Box from '@mui/material/Box'
// materials
import { type ButtonProps } from '@mui/material/Button'
import { Form, type FormikFormProps } from 'formik'
import { memo } from 'react'
// components
import DialogLoadingBar from '@/components/Dialog/LoadingBar'
import FormDeleteButton, {
    type FormDeleteButtonProps,
} from '@/components/form/FormDeleteButton'
import FormResetButton from '@/components/form/ResetButton'
import FormSubmitButton from '@/components/form/SubmitButton'

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
        deleteButton?: FormDeleteButtonProps
        cancelButton?: Omit<ButtonProps, 'disabled' | 'form' | 'type'>
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
            <Form autoComplete={autoComplete} id={formId} {...props}>
                {children}

                <Box display="flex" justifyContent="space-between" mt="1em">
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
                            confirmationText={
                                submitButtonProps.confirmationText
                            }
                            disabled={!dirty || submitButtonProps.disabled}
                            form={formId}
                            loading={submitting}
                            oldDirty={dirty && !isNew}
                        />
                    </Box>
                </Box>
            </Form>
        </>
    )
})

export default FormikForm
