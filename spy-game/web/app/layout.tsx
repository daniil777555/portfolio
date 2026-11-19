import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import StyledJsxRegistry from './registry'
import NotificationProvider from './components/NotificationProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Spy Game',
  description: 'Enter a room, invite your friends and play!',
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png', sizes: '1024x1024' }]
  }
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StyledJsxRegistry>
          <NotificationProvider>{children}</NotificationProvider>
        </StyledJsxRegistry>
      </body>
    </html>
  )
}
