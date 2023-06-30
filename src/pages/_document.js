import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
    return (
        <Html lang="id">
            <Head>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="assets/favicons/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="assets/favicons/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="assets/favicons/favicon-16x16.png"
                />

                <link rel="manifest" href="assets/favicons/site.webmanifest" />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
