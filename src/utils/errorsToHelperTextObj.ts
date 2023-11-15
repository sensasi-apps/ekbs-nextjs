export default function errorsToHelperTextObj(
    errors: string[] | string | undefined,
) {
    return {
        error: !!errors,
        helperText: Array.isArray(errors) ? errors.join(', ') : errors,
    }
}
