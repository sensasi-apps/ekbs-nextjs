// types
import type { FormikFormProps } from 'formik'
import type { LoadingButtonProps } from '@mui/lab/LoadingButton'
// vendors
import { memo } from 'react'
import { Form } from 'formik'
import LoadingButton from '@mui/lab/LoadingButton'
import DeleteIcon from '@mui/icons-material/Delete'
// components
import DialogLoadingBar from '@/components/Dialog/LoadingBar'
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
        submitButton: submitButtonProps,
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
        submitButton: {
            disabled: boolean
        }
    }
} & Omit<FormikFormProps, 'id'>) {
    return (
        <>
            <DialogLoadingBar in={processing} />
            <Form id={formId} autoComplete={autoComplete} {...props}>
                {children}

                <div
                    style={{
                        display: 'flex',
                        gap: '.5em',
                        marginTop: '1em',
                    }}>
                    <span
                        style={{
                            flexGrow: 1,
                        }}>
                        {deleteButtonProps?.onClick && (
                            <LoadingButton
                                color="error"
                                size="small"
                                {...deleteButtonProps}>
                                <DeleteIcon />
                            </LoadingButton>
                        )}
                    </span>

                    <FormResetButton
                        dirty={dirty}
                        disabled={processing}
                        form={formId}
                    />

                    <FormSubmitButton
                        loading={submitting}
                        form={formId}
                        disabled={!dirty || submitButtonProps.disabled}
                        oldDirty={dirty && !isNew}
                    />
                </div>
            </Form>
        </>
    )
})

export default FormikForm
