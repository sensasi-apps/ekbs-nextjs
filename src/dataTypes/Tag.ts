import TransactionTag from '@/enums/TransactionTag'

type Tag = {
    id: number
    name: {
        id: string | TransactionTag
    }
    slug: {
        id: string
    }
}

export default Tag
