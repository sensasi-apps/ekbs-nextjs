import type TransactionTag from '@/features/transaction/enums/transaction-tag'

export default interface TagORM {
    id: number
    name: {
        id: string | TransactionTag
    }
    slug: {
        id: string
    }
}
