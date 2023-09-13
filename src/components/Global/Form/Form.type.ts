import { ReactNode } from 'react'

type FormType<T = undefined> = {
    data?: T
    loading: boolean
    handleClose: () => void
    setSubmitting: (loading: boolean) => void
    actionsSlot: ReactNode
}

export default FormType
