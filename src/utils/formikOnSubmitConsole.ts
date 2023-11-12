import type { FormikHelpers } from 'formik'

/**
 * Logs the form values to the console after a delay of 1 second and sets submitting to false.
 * @param values - The values of the form.
 * @param actions - The Formik helpers.
 * @example
 * ```tsx
 * onSubmit={(values, helper) => formikOnSubmitConsole(values, helper)}
 * ```
 */
export default function formikOnSubmitConsole(
    values: any,
    actions: FormikHelpers<any>,
) {
    setTimeout(() => {
        console.log(values)
        actions.setSubmitting(false)
    }, 1000)
}
