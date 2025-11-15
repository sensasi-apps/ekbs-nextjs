import '@/test-utils/mock-setup'

import { render } from '@testing-library/react'
import { test } from 'vitest'
import Page from './page'

test('Page renders without crashing', () => {
    render(
        <Page
            params={
                new Promise(resolve => {
                    resolve({ token: 'dummy-token' })
                })
            }
        />,
    )
})
