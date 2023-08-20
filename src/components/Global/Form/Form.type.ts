import { ReactNode } from 'react'

type FormType<T> = {
    data: T
    loading: boolean
    handleClose: () => void
    setSubmitting: (loading: boolean) => void
    actionsSlot: ReactNode
}

export default FormType
