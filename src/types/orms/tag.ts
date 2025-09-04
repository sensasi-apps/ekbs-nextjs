import type TransactionTag from '@/modules/transaction/enums/transaction-tag'

export default interface TagORM {
    id: number
    name: {
        id: string | TransactionTag
    }
    slug: {
        id: string
    }
}
