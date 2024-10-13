// types
import type { FormikProps } from 'formik'
import type { Employee } from '@/@types/Data/Employee'
// vendors
import { useDebouncedCallback } from 'use-debounce'
import dayjs from 'dayjs'
// materials
import {
    Fade,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material'
// components
import SelectFromApi from '@/components/Global/SelectFromApi'
import DatePicker from '@/components/DatePicker'
// utils
import errorsToHelperTextObj from '@/utils/errorsToHelperTextObj'
import BusinessUnit from '@/enums/BusinessUnit'
// functions
import { toYmd } from '@/functions/toYmd'

export default function EmployeeForm({
    id,
    values,
    setFieldValue,
    handleSubmit,
    isSubmitting,
    errors,
}: FormikProps<FormValues> & { id: string }) {
    const {
        joined_at,
        unjoined_at,
        unjoined_reason,
        note,
        employee_status_id,
        business_unit_id,
        position,
    } = values

    const setFieldValue__debounced = useDebouncedCallback(
        (name: keyof FormValues, value: string | null) =>
            setFieldValue(name, value),
        500,
    )

    return (
        <form id={id} onSubmit={handleSubmit}>
            <SelectFromApi
                endpoint="/data/employee-statuses"
                label="Status Karyawan"
                disabled={isSubmitting}
                required
                margin="normal"
                size="small"
                selectProps={{
                    value: employee_status_id ?? '',
                    name: 'employee_status_id',
                }}
                onChange={({ target: { value } }) =>
                    setFieldValue('employee_status_id', value as string)
                }
                {...errorsToHelperTextObj(errors?.employee_status_id)}
            />

            <FormControl
                size="small"
                required
                fullWidth
                margin="normal"
                disabled={isSubmitting}>
                <InputLabel id="business-unit-lable">Unit Bisnis</InputLabel>

                <Select
                    required
                    labelId="business-unit-lable"
                    id="business-unit-select"
                    value={business_unit_id ?? ''}
                    label="Unit Bisnis"
                    onChange={({ target: { value } }) =>
                        setFieldValue('business_unit_id', value)
                    }>
                    {BUSINESS_UNIT_OPTIONS.map(({ value, label }, i) => (
                        <MenuItem value={value} key={i}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                fullWidth
                required
                disabled={isSubmitting}
                name="position"
                label="Jabatan"
                margin="normal"
                size="small"
                onChange={({ target: { value } }) =>
                    setFieldValue__debounced('position', value)
                }
                defaultValue={position ?? null}
                {...errorsToHelperTextObj(errors?.position)}
            />

            <DatePicker
                disabled={isSubmitting}
                defaultValue={joined_at ? dayjs(joined_at) : null}
                disableFuture
                onChange={date =>
                    setFieldValue__debounced(
                        'joined_at',
                        date ? toYmd(date) : null,
                    )
                }
                slotProps={{
                    textField: {
                        name: 'joined_at',
                        label: 'Tanggal Bergabung',
                        margin: 'normal',
                        ...errorsToHelperTextObj(errors?.joined_at),
                    },
                }}
            />

            <DatePicker
                disabled={isSubmitting}
                defaultValue={unjoined_at ? dayjs(unjoined_at) : null}
                onChange={date =>
                    setFieldValue__debounced(
                        'unjoined_at',
                        date ? toYmd(date) : null,
                    )
                }
                slotProps={{
                    textField: {
                        required: false,
                        margin: 'normal',
                        name: 'unjoined_at',
                        label: 'Tanggal Keluar',
                        ...errorsToHelperTextObj(errors?.unjoined_at),
                    },
                }}
            />

            <Fade in={!!unjoined_at} unmountOnExit>
                <TextField
                    fullWidth
                    multiline
                    disabled={isSubmitting}
                    name="unjoined_reason"
                    label="Alasan Berhenti/Keluar"
                    margin="normal"
                    size="small"
                    defaultValue={unjoined_reason ?? ''}
                    onChange={({ target: { value } }) =>
                        setFieldValue__debounced('unjoined_reason', value)
                    }
                    {...errorsToHelperTextObj(errors?.unjoined_reason)}
                />
            </Fade>

            <TextField
                fullWidth
                multiline
                name="note"
                disabled={isSubmitting}
                label="Catatan tambahan"
                margin="normal"
                size="small"
                defaultValue={note ?? ''}
                onChange={({ target: { value } }) =>
                    setFieldValue__debounced('note', value)
                }
                {...errorsToHelperTextObj(errors?.note)}
            />
        </form>
    )
}

export type FormValues = Partial<Omit<Employee, 'employee_status'>>

const BUSINESS_UNIT_OPTIONS: {
    value: BusinessUnit
    label: string
}[] = [
    {
        value: BusinessUnit.ALAT_BERAT,
        label: 'Alat Berat',
    },
    {
        value: BusinessUnit.BELAYAN_MART,
        label: 'Belayan Mart',
    },
    {
        value: BusinessUnit.BENGKEL,
        label: 'Bengkel',
    },
    {
        value: BusinessUnit.COFFEESHOP_DEPAN_KANTOR,
        label: 'Coffeeshop Depan Kantor',
    },
    {
        value: BusinessUnit.SAPRODI,
        label: 'Saprodi',
    },
    {
        value: BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN,
        label: 'Sertifikasi dan Pengelolaan Kebun',
    },
    {
        value: BusinessUnit.SPP,
        label: 'SPP',
    },
    {
        value: BusinessUnit.TBS,
        label: 'TBS',
    },
]
