import { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default function Document() {
  return (
    <Html lang="pt">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta charSet="UTF-8" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <body style={{ minHeight: '100vh' }}>
        <Main />
        <NextScript />
      </body>
      <footer
        style={{
          background: 'green',
          position: 'sticky',
          top: '100%',
          height: '40px',
          display: 'flex',
          flex: '1',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <a
          href="https://www.brunoguedesdev.com.br"
          target="_blank"
          rel="noreferrer"
        >
          Desenvolvido por Bruno Guedes
        </a>
      </footer>
    </Html>
  )
}
