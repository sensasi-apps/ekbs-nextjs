import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { UAParser } from 'ua-parser-js'
import BROWSER_MINIMUM_VERSIONS from './BROWSER_MINIMUM_VERSIONS'

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
            !path?.startsWith('/browser-checks') &&
            !path?.startsWith('/_error')
        ) {
            replace('/browser-checks')
        }

        if (!isUnsupported && path?.startsWith('/browser-checks')) {
            replace('/')
        }
    }, [replace, path])
}
