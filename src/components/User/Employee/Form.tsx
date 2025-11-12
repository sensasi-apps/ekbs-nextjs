// types

// materials
import Fade from '@mui/material/Fade'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import dayjs from 'dayjs'
import type { FormikProps } from 'formik'
// vendors
import { useDebouncedCallback } from 'use-debounce'
import DatePicker from '@/components/DatePicker'
// components
import SelectFromApi from '@/components/Global/SelectFromApi'
import BusinessUnit from '@/enums/business-unit'
// features
import type Employee from '@/modules/user/types/orms/employee'
// utils
import errorsToHelperTextObj from '@/utils/errors-to-helper-text-obj'
// functions
import { toYmd } from '@/utils/to-ymd'

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
                disabled={isSubmitting}
                endpoint="/data/employee-statuses"
                label="Status Karyawan"
                margin="normal"
                onChange={({ target: { value } }) =>
                    setFieldValue('employee_status_id', value as string)
                }
                required
                selectProps={{
                    name: 'employee_status_id',
                    value: employee_status_id ?? '',
                }}
                size="small"
                {...errorsToHelperTextObj(errors?.employee_status_id)}
            />

            <FormControl
                disabled={isSubmitting}
                fullWidth
                margin="normal"
                required
                size="small">
                <InputLabel id="business-unit-lable">Unit Bisnis</InputLabel>

                <Select
                    id="business-unit-select"
                    label="Unit Bisnis"
                    labelId="business-unit-lable"
                    onChange={({ target: { value } }) =>
                        setFieldValue('business_unit_id', value)
                    }
                    required
                    value={business_unit_id ?? ''}>
                    {BUSINESS_UNIT_OPTIONS.map(({ value, label }) => (
                        <MenuItem key={value} value={value}>
                            {label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <TextField
                defaultValue={position ?? null}
                disabled={isSubmitting}
                fullWidth
                label="Jabatan"
                margin="normal"
                name="position"
                onChange={({ target: { value } }) =>
                    setFieldValue__debounced('position', value)
                }
                required
                size="small"
                {...errorsToHelperTextObj(errors?.position)}
            />

            <DatePicker
                defaultValue={joined_at ? dayjs(joined_at) : null}
                disabled={isSubmitting}
                disableFuture
                onChange={date =>
                    setFieldValue__debounced(
                        'joined_at',
                        date ? toYmd(date) : null,
                    )
                }
                slotProps={{
                    textField: {
                        label: 'Tanggal Bergabung',
                        margin: 'normal',
                        name: 'joined_at',
                        ...errorsToHelperTextObj(errors?.joined_at),
                    },
                }}
            />

            <DatePicker
                defaultValue={unjoined_at ? dayjs(unjoined_at) : null}
                disabled={isSubmitting}
                onChange={date =>
                    setFieldValue__debounced(
                        'unjoined_at',
                        date ? toYmd(date) : null,
                    )
                }
                slotProps={{
                    textField: {
                        label: 'Tanggal Keluar',
                        margin: 'normal',
                        name: 'unjoined_at',
                        required: false,
                        ...errorsToHelperTextObj(errors?.unjoined_at),
                    },
                }}
            />

            <Fade in={!!unjoined_at} unmountOnExit>
                <TextField
                    defaultValue={unjoined_reason ?? ''}
                    disabled={isSubmitting}
                    fullWidth
                    label="Alasan Berhenti/Keluar"
                    margin="normal"
                    multiline
                    name="unjoined_reason"
                    onChange={({ target: { value } }) =>
                        setFieldValue__debounced('unjoined_reason', value)
                    }
                    size="small"
                    {...errorsToHelperTextObj(errors?.unjoined_reason)}
                />
            </Fade>

            <TextField
                defaultValue={note ?? ''}
                disabled={isSubmitting}
                fullWidth
                label="Catatan tambahan"
                margin="normal"
                multiline
                name="note"
                onChange={({ target: { value } }) =>
                    setFieldValue__debounced('note', value)
                }
                size="small"
                {...errorsToHelperTextObj(errors?.note)}
            />
        </form>
    )
}

type FormValues = Partial<Omit<Employee, 'employee_status'>>

const BUSINESS_UNIT_OPTIONS: {
    value: BusinessUnit
    label: string
}[] = [
    {
        label: 'Alat Berat',
        value: BusinessUnit.ALAT_BERAT,
    },
    {
        label: 'Belayan Mart',
        value: BusinessUnit.BELAYAN_MART,
    },
    {
        label: 'Bengkel',
        value: BusinessUnit.BENGKEL,
    },
    {
        label: 'Coffeeshop Depan Kantor',
        value: BusinessUnit.COFFEESHOP_DEPAN_KANTOR,
    },
    {
        label: 'Saprodi',
        value: BusinessUnit.SAPRODI,
    },
    {
        label: 'Sertifikasi dan Pengelolaan Kebun',
        value: BusinessUnit.SERTIFIKASI_DAN_PENGELOLAAN_KEBUN,
    },
    {
        label: 'SPP',
        value: BusinessUnit.SPP,
    },
    {
        label: 'TBS',
        value: BusinessUnit.TBS,
    },
]
