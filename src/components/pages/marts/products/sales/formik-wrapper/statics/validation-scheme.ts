import type { FormValuesType } from '../@types/form-values-type'
import * as yup from 'yup'

export const VALIDATION_SCHEMA = yup.object().shape({
    // at: // no need to validate this field because it's auto-generated when submitting form
    // paid: // no need to validate this field because it's auto-generated when submitting form

    cashable_uuid: yup
        .string()
        .uuid()
        .required('Metode pembayaran tidak boleh kosong'),

    costs: yup.array().of(
        yup.object().shape({
            name: yup.string().required('Nama tidak boleh kosong'),
            rp: yup.number().required('Jumlah tidak boleh kosong'),
        }),
    ),

    details: yup
        .array()
        .of(
            yup.object().shape({
                product_id: yup.number().required('Barang tidak boleh kosong'),
                qty: yup.number().required('Jumlah barang tidak boleh kosong'),
                rp_per_unit: yup
                    .number()
                    .min(1, 'Harga jual tidak boleh nol')
                    .required('Harga jual tidak boleh kosong'),
            }),
        )
        .min(1, 'Barang tidak boleh kosong'),

    buyer_user_uuid: yup.string().uuid(),

    total_payment: yup
        .number()
        .required('Total pembayaran tidak boleh kosong')
        .when(['details', 'costs'], (data: Array<unknown>, schema) => {
            const details = data[0] as FormValuesType['details']
            const costs = data[1] as FormValuesType['costs']

            const total =
                details.reduce(
                    (acc, { qty, rp_per_unit }) => acc + qty * rp_per_unit,
                    0,
                ) + costs.reduce((acc, { rp }) => acc + (rp ?? 0), 0)

            return schema.min(
                total,
                'Total pembayaran tidak boleh kurang dari total belanja',
            )
        }),
})
