const errorThrower = (error: any) => {
    if (error.code !== 'ERR_NET' && error.response?.status !== 422) {
        throw error
    }

    return error
}

export default errorThrower
