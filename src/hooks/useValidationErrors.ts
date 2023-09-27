import { useState } from 'react'

import type ValidationErrorsType from '@/types/ValidationErrors'

const useValidationErrors = () => {
    const [validationErrors, setValidationErrors] =
        useState<ValidationErrorsType>({})

    const clearByEvent = (event: React.ChangeEvent<HTMLInputElement>) => {
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
