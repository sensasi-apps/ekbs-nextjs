import '@/providers/_parts/setup-dayjs-locale'

import { beforeEach, vi } from 'vitest'

process.env.NEXT_PUBLIC_BACKEND_URL = 'https://testing.com'

if (!window.localStorage) {
    const values = new Map<string, string>()
    const storage: Storage = {
        clear: () => values.clear(),
        getItem: key => values.get(key) ?? null,
        key: index => [...values.keys()][index] ?? null,
        get length() {
            return values.size
        },
        removeItem: key => values.delete(key),
        setItem: (key, value) => values.set(key, value),
    }

    Object.defineProperty(window, 'localStorage', { value: storage })
    Object.defineProperty(globalThis, 'localStorage', { value: storage })
}

vi.mock('next/navigation', () => ({
    useParams: vi.fn(() => ({})),
    usePathname: vi.fn(() => '/'),
    useRouter: vi.fn(() => ({
        prefetch: vi.fn(),
        push: vi.fn(),
        replace: vi.fn(),
    })),
    useSearchParams: vi.fn(() => ({
        entries: vi.fn(() => [][Symbol.iterator]()),
        get: vi.fn(),
    })),
}))

vi.mock('notistack', () => ({
    enqueueSnackbar: vi.fn(),
}))

vi.mock('@/sw/statics/bg-sync-queue-instances/mart-sales', () => ({
    default: vi.fn(() => Promise.resolve(null)),
}))

vi.mock('@/utils/post-to-sw', () => ({
    postToSw: vi.fn(() => Promise.resolve(null)),
}))

vi.mock('@/lib/db-promise', () => ({
    default: vi.fn(() => Promise.resolve(null)),
}))

beforeEach(() => {
    vi.clearAllMocks()
})
