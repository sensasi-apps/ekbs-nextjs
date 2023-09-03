import { useState } from 'react'

import ValidationErrorsType from '@/types/ValidationErrors.type'

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
