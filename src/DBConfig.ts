const DBConfig: DBConfigType = {
    name: 'ekbsDB',
    version: 1,
    objectStores: [
        {
            name: 'formDataDrafts',
            optionalParameters: {
                keyPath: 'id',
                autoIncrement: true,
            },
            indexes: [
                {
                    name: 'modelName',
                    keyPath: 'modelName',
                },
                {
                    name: 'nameId',
                    keyPath: ['modelName', 'nameId'],
                    options: { unique: true },
                },
            ],
        },
    ],
}

export default DBConfig

interface objectStores {
    name: string
    optionalParameters?: IDBObjectStoreParameters
    indexes?: {
        name: string
        keyPath: string | string[]
        options?: IDBIndexParameters
    }[]
}

interface DBConfigType {
    name: string
    version: number
    objectStores: objectStores[]
}
