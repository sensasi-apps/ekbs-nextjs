import type TransactionTag from '@/enums/TransactionTag'

export default interface Tag {
    id: number
    name: {
        id: string | TransactionTag
    }
    slug: {
        id: string
    }
}
