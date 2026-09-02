import { render, waitFor } from '@testing-library/react'
import { expect, test, vi } from 'vitest'
import '@/test-utils/mock-setup'
import Page from './page'

const { post, setAuthInfo } = vi.hoisted(() => ({
    post: vi.fn(() => Promise.resolve()),
    setAuthInfo: vi.fn(),
}))

vi.mock('@/lib/axios', () => ({
    currentAuthInfoPromise: Promise.resolve(undefined),
    default: { post },
}))

vi.mock('@/hooks/use-auth-info-state', () => ({
    default: () => [
        {
            id: 1,
            is_active: true,
            name: 'User',
            permission_names: [],
            role_names: [],
            should_revoke_access_token_on_logout: true,
            uuid: '10c9a58c-e330-4cc7-a423-bf435341bc21',
        },
        setAuthInfo,
    ],
}))

test('Page renders without crashing', () => {
    render(<Page />)
})

test('logs out the shared session without revoking a browser token', async () => {
    render(<Page />)

    await waitFor(() => {
        expect(post).toHaveBeenCalledOnce()
        expect(post).toHaveBeenCalledWith('/logout')
    })
})
