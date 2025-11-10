"use client"

import { Theme } from '@radix-ui/themes'

export function RadixThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Theme accentColor="teal" grayColor="sand" radius="full">
      {children}
    </Theme>
  )
}

