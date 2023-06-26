import '@/styles/globals.css'
import { LocalizationProvider } from '@mui/x-date-pickers'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React, { ReactNode } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const NatyApp = ({ Component, pageProps }: AppProps) => {
  const getLayout = Component.getLayout || ((page: ReactNode) => page)
  return (
    <>
      <Head>
        <meta name="og:title" content={'API Deslocamento'} />
        <title>API Deslocamento</title>
      </Head>
      {getLayout(
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Component {...pageProps} />
        </LocalizationProvider>
      )}
    </>
  )
}

export default NatyApp
