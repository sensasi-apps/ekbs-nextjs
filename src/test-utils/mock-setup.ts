import '@/providers/_parts/setup-dayjs-locale'

import { beforeEach, vi } from 'vitest'

process.env.NEXT_PUBLIC_BACKEND_URL = 'https://testing.com'

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
