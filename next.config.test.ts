// @vitest-environment node
import {
    getRewrittenUrl,
    unstable_getResponseFromNextConfig,
} from 'next/experimental/testing/server'
import { afterEach, expect, test, vi } from 'vitest'
import nextConfig from './next.config'

vi.hoisted(async () => {
    const { AsyncLocalStorage } = await import('node:async_hooks')
    vi.stubGlobal('AsyncLocalStorage', AsyncLocalStorage)
})

afterEach(() => vi.unstubAllEnvs())

test.each([
    ['/laporan-kinerja', '/laporan-kinerja'],
    ['/performance-report', '/performance-report'],
    ['/laporan-kinerja.pdf', '/laporan-kinerja.pdf'],
    ['/performance-report.pdf', '/performance-report.pdf'],
])('rewrites %s to the v2 report', async (source, destination) => {
    vi.stubEnv('NEXT_PUBLIC_V2_DOMAIN', 'https://v2.example.com')
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'https://api.example.com')
    const response = await unstable_getResponseFromNextConfig({
        nextConfig,
        url: `https://legacy.example.com${source}?download=1`,
    })

    expect(getRewrittenUrl(response)).toBe(
        `https://v2.example.com${destination}?download=1`,
    )
})

test.each([
    '/laporan-performa',
    '/laporan-performa.pdf',
])('does not rewrite the discarded alias %s', async source => {
    vi.stubEnv('NEXT_PUBLIC_V2_DOMAIN', 'https://v2.example.com')
    vi.stubEnv('NEXT_PUBLIC_BACKEND_URL', 'https://api.example.com')
    const response = await unstable_getResponseFromNextConfig({
        nextConfig,
        url: `https://legacy.example.com${source}`,
    })

    expect(getRewrittenUrl(response)).toBeNull()
})
