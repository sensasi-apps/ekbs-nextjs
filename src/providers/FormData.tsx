import { createContext, type ReactNode, useContext, useState } from 'react'

const FormDataCtx = createContext({
    data: undefined,
    handleClose: () => {},
    handleCreate: () => {},
    handleEdit: () => {},
    isDataNotUndefined: false,
    isNew: true,
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
                handleClose: () => setData(undefined),
                handleCreate: (data?: unknown) => setData(data ?? {}),
                handleEdit: (data: unknown) => setData(data),
                isDataNotUndefined: data !== undefined,
                // @ts-expect-error delete this file if fully migrated to formik
                isNew: !(data?.uuid || data?.id),
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
