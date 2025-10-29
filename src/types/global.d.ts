import Echo from '@ably/laravel-echo'
import * as Ably from 'ably'

declare global {
    interface Window {
        Ably?: Ably
        Echo?: Echo
    }
}

// This is needed for TypeScript to treat this file as a module
export {}
