// materials

import Chip from '@mui/material/Chip'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
//
import type { UUID } from 'crypto'
import { Formik, type FormikProps, useFormikContext } from 'formik'
import useSWR from 'swr'
import AutoComplete from '@/components/formik-fields/auto-complete'
// formik
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
import FormikForm from '@/components/formik-form-v2'
import axios from '@/lib/axios'
// modules
import type SparePartMovementORM from '@/modules/repair-shop/types/orms/spare-part-movement'
// utils
import handle422 from '@/utils/handle-422'

export default function SparePartQtyAdjustmentFormDialog({
    formValues,
    selectedRow,
    onSubmitted,
    onClose,
}: {
    formValues: CreateFormValues | undefined
    selectedRow?: SparePartMovementORM
    onSubmitted: (uuid: UUID) => void
    onClose: () => void
}) {
    return (
        <Dialog disableRestoreFocus maxWidth="xs" open={Boolean(formValues)}>
            <DialogTitle>
                {(selectedRow?.uuid === undefined ? 'Tambah' : 'Perbarui') +
                    ' Data Opname Suku Cadang'}
            </DialogTitle>

            <DialogContent>
                <Formik
                    component={Form}
                    initialStatus={selectedRow}
                    initialValues={formValues ?? {}}
                    onReset={onClose}
                    onSubmit={(values, { setErrors }) =>
                        (values?.uuid
                            ? axios.put(
                                  `/repair-shop/spare-parts/qty-adjustments/${values?.uuid}`,
                                  {
                                      note: values.note,
                                  },
                              )
                            : axios.post<UUID>(
                                  '/repair-shop/spare-parts/qty-adjustments/create',
                                  {
                                      ...values,
                                      categories: values.categories?.map(
                                          category => category.id,
                                      ),
                                  },
                              )
                        )
                            .then(res => onSubmitted(res.data))
                            .catch(error => handle422(error, setErrors))
                    }
                />
            </DialogContent>
        </Dialog>
    )
}

interface Category {
    category: string
    total: number
}

interface CategoryOption {
    id: string
    label: string
}

function Form({
    // isSubmitting,
    // dirty,
    // status,
    values,
}: FormikProps<CreateFormValues>) {
    const { data: categories = [] } = useSWR<Category[]>(
        '/repair-shop/spare-parts/categories',
    )

    return (
        <FormikForm>
            <DateField
                datePickerProps={{
                    format: 'YYYY-MM-DD HH:mm',
                }}
                disabled
                label="Tanggal"
                name="at"
            />

            <AutoComplete
                disabled={Boolean(values?.uuid)}
                multiple
                name="categories"
                options={categories.map(category => ({
                    id: category.category,
                    label: category.category + ' (' + category.total + ')',
                }))}
                slotProps={{
                    textField: {
                        label: 'Kategori',
                    },
                }}
            />

            <TotalItem categories={categories} />

            <TextField
                label="Catatan"
                name="note"
                textFieldProps={{
                    minRows: 2,
                    multiline: true,
                    required: false,
                }}
            />
        </FormikForm>
    )
}

function TotalItem({ categories }: { categories: Category[] }) {
    const { getFieldMeta } = useFormikContext()

    const { value = [] } = getFieldMeta<CategoryOption[]>('categories')

    const totalSelectedItem = value.reduce(
        (total, category) =>
            total +
            (categories.find(cat => cat.category === category.id)?.total ?? 0),
        0,
    )

    return (
        <Chip
            color="primary"
            label={`Total Barang: ${totalSelectedItem}`}
            size="small"
        />
    )
}

export type CreateFormValues = Partial<{
    readonly uuid: string
    at: SparePartMovementORM['at']
    note: SparePartMovementORM['note']
    categories: CategoryOption[]
}>
