import '@/test-utils/mock-setup'

import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import Page from './page'

test('Page renders without crashing', () => {
    render(<Page />)
    expect(
        screen
            .getByRole('link', { name: 'Laporan Kinerja' })
            .getAttribute('href'),
    ).toBe('/laporan-kinerja')
})
