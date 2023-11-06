import type LaravelValidationException from '@/types/LaravelValidationException'

export default function errorCatcher(
    error: any,
    setErrors?: (errors: any) => void,
) {
    if (error?.response?.status !== 422) {
        throw error
    }
    if (setErrors && error.response.status === 422) {
        const { errors }: LaravelValidationException = error.response.data
        setErrors(errors)
    }
}
