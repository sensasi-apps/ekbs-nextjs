'use client'

import { AppProgressProvider } from '@bprogress/next'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
    return (
        <AppProgressProvider
            color="green"
            height="4px"
            options={{
                showSpinner: false,
            }}
            shallowRouting
            startOnLoad>
            {children}
        </AppProgressProvider>
    )
}
