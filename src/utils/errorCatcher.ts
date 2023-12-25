import type { AxiosError } from 'axios'
import type LaravelValidationException from '@/types/LaravelValidationException'

export default function handle422(
    error: AxiosError,
    callback: (errors: LaravelValidationException['errors']) => any,
) {
    const { response } = error

    if (response) {
        const { status, data } = response

        if (status === 422) {
            const { errors } = data as LaravelValidationException
            return callback(errors)
        }
    }
}
