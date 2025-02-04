import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
})

/** @type { import("eslint").Linter.Config[] } */

const config = [
    ...compat.extends('next/core-web-vitals', 'next/typescript'),

    {
        rules: {
            'no-console': 'warn',

            // '@next/next/no-img-element': 'off',

            // "import/no-restricted-paths": [
            //     "error",
            //     {
            //         "zones": [
            //             {
            //                 "target": "./src",
            //                 "from": "../",
            //                 "message": "Hindari impor lintas direktori di luar src"
            //             }
            //         ]
            //     }
            // ]

            'no-restricted-imports': [
                'error',
                {
                    paths: [
                        {
                            name: '@mui/material',
                            message:
                                "Please use `import [Component] from '@mui/material/[Component]'` instead.",
                        },
                        {
                            name: '@mui/icons-material',
                            message:
                                "Please use `import [Component] from '@mui/icons-material/[Component]'` instead.",
                        },
                    ],
                    patterns: ['!@mui/material/*', '!@mui/icons-material/*'],
                },
            ],
        },
    },

    eslintPluginPrettierRecommended,
]

export default config
