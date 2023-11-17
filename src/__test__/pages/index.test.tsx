/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Index from '@/pages/index'

const mock = jest.fn()

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            pathname: '/',
            replace: mock,
        }
    },
}))

jest.mock('@/providers/Auth', () => ({
    __esModule: true,
    default: () => ({
        user: null,
    }),
}))

describe('Index', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('initial render page', () => {
        render(<Index />)

        expect(screen.getByRole('img')).toHaveAttribute('alt', 'logo')
        expect(screen.getByRole('progressbar')).toBeInTheDocument()
    })
})
