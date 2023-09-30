import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="id">
            <Head>
                <meta
                    name="application-name"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="default"
                />
                <meta
                    name="apple-mobile-web-app-title"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    name="description"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta
                    name="msapplication-config"
                    content="/icons/browserconfig.xml"
                />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                <link
                    rel="apple-touch-icon"
                    href="/assets/favicons/apple-touch-icon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="152x152"
                    href="/assets/favicons/apple-touch-icon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/assets/favicons/apple-touch-icon.png"
                />
                <link
                    rel="apple-touch-icon"
                    sizes="167x167"
                    href="/assets/favicons/apple-touch-icon.png"
                />

                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/assets/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/assets/favicons/favicon-16x16.png"
                />

                <link rel="manifest" href="/assets/favicons/site.webmanifest" />
                <link
                    rel="mask-icon"
                    href="/icons/safari-pinned-tab.svg"
                    color="#5bbad5"
                />
                <link rel="shortcut icon" href="/favicon.ico" />

                <meta
                    name="twitter:card"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    name="twitter:url"
                    content="https://ekbs.belayansejahtera.org"
                />
                <meta
                    name="twitter:title"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    name="twitter:description"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    name="twitter:image"
                    content="https://ekbs.belayansejahtera.org/assets/favicons/android-chrome-192x192.png"
                />
                <meta name="twitter:creator" content="@sensasi_DELIGHT" />

                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    property="og:description"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    property="og:site_name"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    property="og:url"
                    content="https://ekbs.belayansejahtera.org"
                />
                <meta
                    property="og:image"
                    content="https://ekbs.belayansejahtera.org/icons/apple-touch-icon.png"
                />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
