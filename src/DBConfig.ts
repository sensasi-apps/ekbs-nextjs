const DBConfig: DBConfigType = {
    name: 'ekbsDB',
    objectStores: [
        {
            indexes: [
                {
                    keyPath: 'modelName',
                    name: 'modelName',
                },
                {
                    keyPath: ['modelName', 'nameId'],
                    name: 'nameId',
                    options: { unique: true },
                },
            ],
            name: 'formDataDrafts',
            optionalParameters: {
                autoIncrement: true,
                keyPath: 'id',
            },
        },
    ],
    version: 1,
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
