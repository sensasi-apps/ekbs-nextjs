import {
    type DocumentHeadTagsProps,
    DocumentHeadTags,
    documentGetInitialProps,
} from '@mui/material-nextjs/v15-pagesRouter'
import {
    type DocumentProps,
    type DocumentContext,
    Html,
    Head,
    Main,
    NextScript,
} from 'next/document'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

export default function Document(props: DocumentProps & DocumentHeadTagsProps) {
    return (
        <Html lang="id" data-mui-color-scheme="light">
            <Head>
                <DocumentHeadTags {...props} />
                <meta charSet="utf8" />

                <meta
                    name="application-name"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta
                    name="description"
                    content="Koperasi Belayan Sejahtera Elektronik"
                />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />

                <link rel="icon" type="image/png" href="/favicon192.png" />

                <link
                    rel="apple-touch-icon"
                    type="image/png"
                    href="/assets/pwa-icons/white-green.png"
                />

                <link rel="manifest" href="/manifest.webmanifest" />

                <TwitterMetaTags />
                <FacebookMetaTags />
            </Head>

            <body>
                <InitColorSchemeScript attribute="data-mui-color-scheme" />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

const TwitterMetaTags = () => (
    <>
        <meta
            name="twitter:card"
            content="Koperasi Belayan Sejahtera Elektronik"
        />
        <meta name="twitter:url" content="https://ekbs.belayansejahtera.org" />
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
    </>
)

const FacebookMetaTags = () => (
    <>
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
        <meta property="og:url" content="https://ekbs.belayansejahtera.org" />
        <meta
            property="og:image"
            content="https://ekbs.belayansejahtera.org/icons/apple-touch-icon.png"
        />
    </>
)

Document.getInitialProps = async (ctx: DocumentContext) => {
    const finalProps = await documentGetInitialProps(ctx)

    return finalProps
}
