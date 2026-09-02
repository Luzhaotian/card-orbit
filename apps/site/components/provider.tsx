'use client'
import SearchDialog from '@/components/search'
import { zhUITranslations } from '@/lib/i18n-ui'
import { RootProvider } from 'fumadocs-ui/provider/next'
import { type ReactNode } from 'react'

export function Provider({ children }: { children: ReactNode }) {
  return (
    <RootProvider
      search={{ SearchDialog }}
      i18n={{
        locale: 'zh',
        translations: zhUITranslations,
      }}
    >
      {children}
    </RootProvider>
  )
}
