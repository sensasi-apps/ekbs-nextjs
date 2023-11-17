import type { FormikErrors } from 'formik'

export default function errorsToHelperTextObj(
    errors: string[] | string | undefined | FormikErrors<unknown>,
) {
    return {
        error: errors !== undefined,
        helperText: errors?.toString(),
    }
}
