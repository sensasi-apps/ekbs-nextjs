import { atom, useAtomValue } from 'jotai'

export const layoutData = atom<{
    title: string
    subtitle?: string
}>()

export function useGetLayoutData() {
    return useAtomValue(layoutData)
}
