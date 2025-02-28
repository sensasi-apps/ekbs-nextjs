// vendors
import Head from 'next/head'
import { type IBrowser, UAParser } from 'ua-parser-js'
import { useEffect, useState } from 'react'
// components
import FooterBoxWithLogo from '@/components/Layouts/FooterBox/WithLogo'
import { BROWSER_MINIMUM_VERSIONS } from '@/hooks/useRedirectIfBrowserIsUnsupported'

export default function Outdated() {
    const [browser, setBrowser] = useState<IBrowser>()
    const [minimumVersion, setMinimumVersion] = useState<number>()

    useEffect(() => {
        const browser = new UAParser().getBrowser()

        setBrowser(browser)
        setMinimumVersion(
            BROWSER_MINIMUM_VERSIONS[browser.name?.toLocaleLowerCase() ?? ''],
        )
    }, [])

    return (
        <>
            <Head>
                <title>Versi Peramban Terlalu Rendah</title>
            </Head>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    height: '100vh',
                }}>
                <div
                    style={{
                        maxWidth: '30rem',
                    }}>
                    <div
                        style={{
                            marginTop: '1rem',
                        }}>
                        Sayang sekali
                    </div>
                    <h1
                        style={{
                            marginTop: '0.2rem',
                        }}>
                        Versi Peramban Terlalu Rendah
                    </h1>

                    <p>
                        Anda menggunakan peramban{' '}
                        <span
                            style={{
                                fontWeight: 'bold',
                                color: 'cyan',
                            }}>
                            {browser?.name}
                        </span>{' '}
                        versi{' '}
                        <span
                            style={{
                                fontWeight: 'bold',
                                color: 'cyan',
                            }}>
                            {parseFloat(browser?.version ?? '')}
                        </span>
                        {minimumVersion && (
                            <>
                                , sedangkan versi minimum yang diperlukan EKBS
                                adalah versi{' '}
                                <span
                                    style={{
                                        fontWeight: 'bold',
                                        color: 'lightgreen',
                                    }}>
                                    {minimumVersion}
                                </span>
                            </>
                        )}
                        . Silahkan memperbaharui versi peramban Anda agar dapat
                        mengakses EKBS.
                    </p>
                    <FooterBoxWithLogo />
                </div>
            </div>
        </>
    )
}
