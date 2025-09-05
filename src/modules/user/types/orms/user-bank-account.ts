export default interface UserBankAccountORM {
    uuid: string
    user_uuid: string
    name: string
    // no: string // unused encrypted

    // accessors
    no_decrypted: string
}
