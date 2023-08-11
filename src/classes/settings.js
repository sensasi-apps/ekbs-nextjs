import axios from '@/lib/axios'

class Settings {
    static data

    static get(name) {
        const setting = Settings.data?.find(setting => setting.name === name)

        return isNaN(setting?.value) ? setting?.value : parseInt(setting?.value)
    }
}

axios.get('/data/settings').then(res => (Settings.data = res.data))

export default Settings
