type LaravelValidationException = {
    message: string
    errors: {
        [key: string]: string[]
    }
}

export default LaravelValidationException
