export default interface LaravelValidationException {
    message: string
    errors: {
        [key: string]: string[]
    }
}
