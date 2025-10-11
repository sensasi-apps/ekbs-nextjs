import type { ChangeEvent } from 'react'
import { useState } from 'react'
import type LaravelValidationExceptionResponse from '@/types/laravel-validation-exception-response'

const useValidationErrors = () => {
    const [validationErrors, setValidationErrors] = useState<
        LaravelValidationExceptionResponse['errors']
    >({})

    const clearByEvent = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const name = event.target.name

        if (validationErrors[name]) {
            setValidationErrors(prev => {
                delete prev[name]
                return { ...prev }
            })
        }
    }

    const clearByName = (name: string) => {
        if (validationErrors[name]) {
            setValidationErrors(prev => {
                delete prev[name]
                return { ...prev }
            })
        }
    }

    return {
        clearByEvent,
        clearByName,
        setValidationErrors,
        validationErrors,
    }
}

export default useValidationErrors
