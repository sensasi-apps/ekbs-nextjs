/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Index from '@/pages/index'

const replaceFnMock = jest.fn()

jest.mock('@/lib/debounce', () => jest.fn(fn => fn()))

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            replace: replaceFnMock,
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

        expect(replaceFnMock).toHaveBeenCalledTimes(1)
        expect(replaceFnMock).toHaveBeenCalledWith('/login')
    })
})
