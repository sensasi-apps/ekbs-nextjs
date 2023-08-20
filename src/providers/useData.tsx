import { createContext, useContext, useState, PropsWithChildren } from 'react'

const DataContext = createContext({} as UseDataProps)

const DataProvider = ({ children }: PropsWithChildren) => {
    const [data, setData] = useState<any>({})
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isNew = !(data?.uuid || data?.id)

    const handleClose = () => setIsOpen(false)

    const handleOpen = () => setIsOpen(true)

    const handleEdit = (data: object) => {
        setData(data)
        handleOpen()
    }

    const handleCreate = () => {
        setData({})
        handleOpen()
    }

    return (
        <DataContext.Provider
            value={{
                data,
                setData,
                isNew,
                isOpen,
                isLoading,
                setIsLoading,
                handleClose,
                handleEdit,
                handleCreate,
            }}>
            {children}
        </DataContext.Provider>
    )
}

type UseDataProps = {
    data: any
    setData: (data: object) => void
    isNew: boolean
    isOpen: boolean
    isLoading: boolean
    setIsLoading: (value: boolean) => void
    handleClose: () => void
    handleEdit: (data: object) => void
    handleCreate: () => void
}

const useData = () => useContext(DataContext)

export default useData
export { DataProvider }
