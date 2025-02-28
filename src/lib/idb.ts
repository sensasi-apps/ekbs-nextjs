import DBConfig from '@/DBConfig'
import { openDB, type IDBPDatabase } from 'idb'

let dbPromise: Promise<IDBPDatabase>

if (typeof window !== 'undefined') {
    if (!('indexedDB' in window) || window.indexedDB === undefined) {
        throw new Error('Browser does not support IndexedDB')
    }

    const { name, version, objectStores } = DBConfig
    dbPromise = openDB(name, version, {
        upgrade(db) {
            objectStores?.forEach(store => {
                const { name, optionalParameters, indexes } = store

                if (db.objectStoreNames.contains(name)) {
                    db.deleteObjectStore(name)
                }

                const storeObj = db.createObjectStore(name, optionalParameters)

                indexes?.forEach(({ name, keyPath, options }) =>
                    storeObj.createIndex(name, keyPath, options),
                )
            })
        },
    })
}

export { dbPromise }
