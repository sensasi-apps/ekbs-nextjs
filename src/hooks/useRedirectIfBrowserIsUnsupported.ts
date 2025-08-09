import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UAParser } from 'ua-parser-js'

export default function useRedirectIfBrowserIsUnsupported() {
    const { replace } = useRouter()
    const path = usePathname()

    useEffect(() => {
        const { name, version } = new UAParser().getBrowser()

        const isUnsupported =
            name &&
            version &&
            name.toLowerCase() in BROWSER_MINIMUM_VERSIONS &&
            parseFloat(version) < BROWSER_MINIMUM_VERSIONS[name]

        if (
            isUnsupported &&
            !path?.startsWith('/outdated') &&
            !path?.startsWith('/_error')
        ) {
            replace('/outdated')
        }

        if (!isUnsupported && path?.startsWith('/outdated')) {
            replace('/')
        }
    }, [replace, path])
}

/**
 * @see https://github.com/mui/material-ui/blob/v5.15.14/.browserslistrc
 */
export const BROWSER_MINIMUM_VERSIONS: {
    [key: string]: number
} = {
    baidu: 7.12,
    // and_chr: 91,
    // and_ff: 89,
    // and_qq: 10.4,
    // and_uc: 12.12,
    ie: 11,
    chrome: 90,
    google: 90,
    android: 91,
    'chrome mobile webview': 91,
    'chrome mobile': 91,
    headlesschrome: 91,
    edge: 91,
    'edge-chromium': 91,
    firefox: 78,
    'firefox mobile': 78,
    kaios: 2.5,
    'opera mobile': 73,
    'opera mini': 0,
    opera: 76,
    'mobile safari': 12.2,
    safari: 14,
    samsung: 13.0,
    'samsung internet': 13.0,
    // favicon???,
    // MiuiBrowser???
}
