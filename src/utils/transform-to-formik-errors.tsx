import type LaravelValidationException from '@/types/laravel-validation-exception-response'
import type { FormikErrors } from 'formik'

export function transformToFormikErrors<FormValues>(
    laravelvalidationErrors: LaravelValidationException['errors'],
): FormikErrors<FormValues> {
    const output: FormikErrors<FormValues> = {}

    for (const key in laravelvalidationErrors) {
        const pathParts = key.split('.')
        let current = output

        pathParts.forEach((part, index) => {
            const isLastPart = index === pathParts.length - 1
            const nextPartIsArrayIndex = !isNaN(Number(pathParts[index + 1]))

            if (isLastPart) {
                // @ts-expect-error - I'm not sure how to fix this
                current[part] = laravelvalidationErrors[key][0]
            } else {
                // @ts-expect-error - I'm not sure how to fix this
                current[part] =
                    // @ts-expect-error - I'm not sure how to fix this
                    current[part] ?? (nextPartIsArrayIndex ? [] : {})

                // @ts-expect-error - I'm not sure how to fix this
                current = current[part]
            }
        })
    }

    return output
}
