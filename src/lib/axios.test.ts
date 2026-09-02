import { expect, test, vi } from 'vitest'
import '@/test-utils/mock-setup'

const { get } = vi.hoisted(() => ({
    get: vi
        .fn()
        .mockResolvedValueOnce({})
        .mockResolvedValueOnce({ data: null }),
}))

vi.mock('axios', async importOriginal => {
    const axios = await importOriginal<typeof import('axios')>()

    return {
        ...axios,
        default: {
            create: () => ({
                get,
                interceptors: {
                    request: { use: vi.fn() },
                    response: { use: vi.fn() },
                },
            }),
        },
    }
})

test('does not reload when browser and server are unauthenticated', async () => {
    localStorage.removeItem('currentAuthInfo')
    const removeItem = vi.spyOn(localStorage, 'removeItem')
    const { currentAuthInfoPromise } = await import('./axios')

    await currentAuthInfoPromise

    expect(removeItem).not.toHaveBeenCalled()
})
