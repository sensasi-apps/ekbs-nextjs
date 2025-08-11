import { atom, useAtomValue, useSetAtom } from 'jotai'

const isNavbarOpenAtom = atom(false)

export function useIsNavbarOpen() {
    return useAtomValue(isNavbarOpenAtom)
}

export function useToggleIsNavbarOpen() {
    const setIsNavbarOpen = useSetAtom(isNavbarOpenAtom)

    return () => setIsNavbarOpen(prev => !prev)
}
