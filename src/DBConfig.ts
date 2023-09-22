type objectStores = {
    name: string
    optionalParameters?: IDBObjectStoreParameters
    indexes?: {
        name: string
        keyPath: string | string[]
        options?: IDBIndexParameters
    }[]
}

type DBConfigType = {
    name: string
    version: number
    objectStores: objectStores[]
}

const DBConfig: DBConfigType = {
    name: 'ekbsDB',
    version: 1,
    objectStores: [
        {
            name: 'user',
        },
    ],
}

export default DBConfig
