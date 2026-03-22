const vehicleTypes = ['car', 'heavy-equipment', 'motorcycle'] as const

export default vehicleTypes

export const vehicleTypeNames = {
    car: 'Mobil',
    'heavy-equipment': 'Alar Berat',
    motorcycle: 'Motor',
} as const

export type VehicleType = 'car' | 'heavy-equipment' | 'motorcycle'
