export default interface LaravelValidationExceptionResponse {
    message: string
    errors: {
        [key: string]: string[]
    }
}
