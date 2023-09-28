import type ValidationErrorsType from '@/types/ValidationErrors'
import type { ChangeEvent } from 'react'

import { useState } from 'react'

const useValidationErrors = () => {
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrorsType>({})

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
        validationErrors,
        setValidationErrors,
        clearByEvent,
        clearByName,
    }
}

export default useValidationErrors
