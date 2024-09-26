import { v6 } from 'uuid'

export function getDeviceId() {
    const deviceId = localStorage.getItem('deviceId')

    if (!deviceId) {
        const newDeviceId = v6()

        localStorage.setItem('deviceId', newDeviceId)

        return newDeviceId
    }

    return deviceId
}
