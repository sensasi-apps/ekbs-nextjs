import {
    createContext,
    type FC,
    type ReactNode,
    type Reducer,
    useContext,
    useReducer,
} from 'react'

interface ContextType<T = object> extends StateType<T> {
    handleClose: () => void
    handleCreate: () => void
    handleEdit: (data: T) => void
    isDirty: boolean
    isNew: boolean
    loading: boolean
    setData: (value: T) => void
    setDeleting: (value: boolean) => void
    setSubmitting: (value: boolean) => void
}

interface StateType<T = object> {
    data: T
    deleting: boolean
    formOpen: boolean
    initialDataInString: string
    submitting: boolean
}

enum ReducerActions {
    HandleClose = 'HANDLE_CLOSE',
    HandleCreate = 'HANDLE_CREATE',
    HandleEdit = 'HANDLE_EDIT',
    SetData = 'SET_DATA',
    SetDeleting = 'SET_DELETING',
    SetSubmitting = 'SET_SUBMITTING',
}

const initialState: StateType = {
    data: {},
    deleting: false,
    formOpen: false,
    initialDataInString: '{}',
    submitting: false,
}

interface ReducerActionType<T = object> {
    payload?: T | boolean
    type: ReducerActions
}

const reducer: Reducer<StateType, ReducerActionType> = (state, action) => {
    if (action.type === ReducerActions.HandleClose) {
        return {
            ...state,
            formOpen: false,
        }
    }

    if (action.type === ReducerActions.HandleCreate) {
        return {
            ...state,
            data: {},
            formOpen: true,
            initialDataInString: '{}',
        }
    }

    if (action.type === ReducerActions.HandleEdit) {
        return {
            ...state,
            data: action.payload as object,
            formOpen: true,
            initialDataInString: JSON.stringify(action.payload),
        }
    }

    if (action.type === ReducerActions.SetData) {
        return {
            ...state,
            data: action.payload as object,
        }
    }

    if (action.type === ReducerActions.SetDeleting) {
        return {
            ...state,
            deleting: action.payload as boolean,
        }
    }

    if (action.type === ReducerActions.SetSubmitting) {
        return {
            ...state,
            submitting: action.payload as boolean,
        }
    }

    return state
}

const Context = createContext(initialState as ContextType)

export const FormDataProvider: FC<{
    children: ReactNode
}> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const isNew = !(
        ('uuid' in state.data && Boolean(state.data.uuid)) ||
        ('id' in state.data && Boolean(state.data.id))
    )
    const isDirty = state.initialDataInString !== JSON.stringify(state.data)

    return (
        <Context.Provider
            value={{
                ...state,
                handleClose: () =>
                    dispatch({ type: ReducerActions.HandleClose }),
                handleCreate: () =>
                    dispatch({ type: ReducerActions.HandleCreate }),
                handleEdit: data =>
                    dispatch({
                        payload: data,
                        type: ReducerActions.HandleEdit,
                    }),
                isDirty,
                isNew,
                loading: state.submitting || state.deleting,
                setData: data =>
                    dispatch({
                        payload: data,
                        type: ReducerActions.SetData,
                    }),
                setDeleting: (value: boolean) =>
                    dispatch({
                        payload: value,
                        type: ReducerActions.SetDeleting,
                    }),
                setSubmitting: (value: boolean) =>
                    dispatch({
                        payload: value,
                        type: ReducerActions.SetSubmitting,
                    }),
            }}>
            {children}
        </Context.Provider>
    )
}

const useFormData = (() => useContext(Context)) as <
    T = object,
>() => ContextType<T>

export default useFormData
