import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Provider } from '@/components/provider'
import './global.css'

const geist = Geist({
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://luzhaotian.github.io/fxshelf'),
  title: {
    default: 'fxshelf',
    template: '%s · fxshelf',
  },
  description: '可复制源码、按需安装的 React / Vue 微动效包书架。',
}

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={`${geist.className} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col antialiased">
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
