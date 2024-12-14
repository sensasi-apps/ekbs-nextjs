import { createContext, ReactNode, useContext, useState } from 'react'

const FormDataCtx = createContext({
    data: undefined,
    isNew: true,
    isDataNotUndefined: false,
    handleClose: () => {},
    handleCreate: () => {},
    handleEdit: () => {},
} as ContextType)

/**
 * @deprecated use formik instead
 */
function FormDataProvider({ children }: { children: ReactNode }) {
    const [data, setData] = useState<unknown>()

    return (
        <FormDataCtx.Provider
            value={{
                data,
                // @ts-expect-error delete this file if fully migrated to formik
                isNew: !(data?.uuid || data?.id),
                isDataNotUndefined: data !== undefined,
                handleClose: () => setData(undefined),
                handleCreate: (data?: unknown) => setData(data ?? {}),
                handleEdit: (data: unknown) => setData(data),
            }}>
            {children}
        </FormDataCtx.Provider>
    )
}

/**
 * @deprecated use formik instead
 */
export default function useFormData() {
    return useContext(FormDataCtx)
}

export { FormDataProvider }

interface ContextType {
    data: unknown | undefined
    isNew: boolean
    isDataNotUndefined: boolean
    handleClose: () => void
    handleCreate: (data?: unknown) => void
    handleEdit: (data: unknown) => void
}
