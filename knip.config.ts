import type { KnipConfig } from 'knip'

const knipConfig: KnipConfig = {
    ignoreDependencies: ['eslint-config-next'],
    next: {
        entry: ['src/sw.ts'],
    },
}

export default knipConfig
