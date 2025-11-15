import { render } from '@testing-library/react'
import { test } from 'vitest'
import '@/test-utils/mock-setup'
import Page from './page'

test('Page renders without crashing', () => {
    render(<Page />)
})
