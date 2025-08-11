'use client'

// vendors
import Head from 'next/head'
import { type IBrowser, UAParser } from 'ua-parser-js'
import { useEffect, useState } from 'react'
// components
import FooterBoxWithLogo from '@/components/Layouts/FooterBox/WithLogo'
// constants
import BROWSER_MINIMUM_VERSIONS from '@/components/redirect-if-browser-is-unsupported/BROWSER_MINIMUM_VERSIONS'

/**
 * Page displaying information about browser is supported or not.
 *
 * @todo Add link to download latest version
 * @todo Add view for supported browsers
 */
export default function Page() {
    const [isClient, setIsClient] = useState(false)
    const [browser, setBrowser] = useState<IBrowser>()
    const [minimumVersion, setMinimumVersion] = useState<number>()

    useEffect(() => {
        const browser = new UAParser().getBrowser()

        setBrowser(browser)
        setMinimumVersion(
            BROWSER_MINIMUM_VERSIONS[browser.name?.toLocaleLowerCase() ?? ''],
        )

        setIsClient(true)
    }, [])

    if (!isClient) return null

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
                    height: '90vh',
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
                        Anda sedang menggunakan peramban{' '}
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
                        . Silakan memperbaharui versi peramban Anda agar dapat
                        mengakses EKBS.
                    </p>

                    <FooterBoxWithLogo />
                </div>
            </div>
        </>
    )
}
