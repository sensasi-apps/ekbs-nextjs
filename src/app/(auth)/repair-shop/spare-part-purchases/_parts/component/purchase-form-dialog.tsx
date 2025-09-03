// vendors
import { FieldArray, Formik, type FormikProps } from 'formik'
import { useState } from 'react'
// materials
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Fade from '@mui/material/Fade'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormGroup from '@mui/material/FormGroup'
import Grid from '@mui/material/Grid'
// components
import FormikForm from '@/components/formik-form'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
// utils
import myAxios from '@/lib/axios'
import handle422 from '@/utils/handle-422'
// feature scope
import type SparePartMovement from '@/app/(auth)/repair-shop/_types/spare-part-movement'
import Endpoint from '../enums/endpoint'
import SelectFromApi from '@/components/Global/SelectFromApi'
import DetailsField from './details-field'
import CostsField from './costs-field'
import type CashType from '@/types/orms/cash'

type FormData = Partial<
    SparePartMovement & {
        cash_uuid: CashType['uuid']
    }
>

export default function PurchaseFormDialog({
    formData,
    handleClose,
}: {
    formData: FormData | undefined
    handleClose: () => void
}) {
    const isNew = !formData?.uuid

    return (
        <Dialog open fullScreen disablePortal>
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Pembelian
            </DialogTitle>

            <DialogContent>
                <Formik<FormData>
                    validateOnChange={false}
                    initialValues={formData ?? {}}
                    onSubmit={(values, { setErrors, resetForm }) => {
                        const request = isNew
                            ? myAxios.post(Endpoint.CREATE, values)
                            : myAxios.put(
                                  Endpoint.UPDATE.replace(
                                      '$1',
                                      values?.uuid ?? '',
                                  ),
                                  values,
                              )

                        return request
                            .then(resetForm)
                            .catch(error => handle422(error, setErrors))
                    }}
                    onReset={handleClose}
                    component={PurchaseFormikForm}
                />
            </DialogContent>
        </Dialog>
    )
}

export function PurchaseFormikForm({
    dirty,
    setFieldValue,
    isSubmitting,
    values,
}: FormikProps<FormData>) {
    const isDisabled = isSubmitting || !!values.finalized_at

    return (
        <FormikForm
            id="spare-part-purchase-form"
            autoComplete="off"
            isNew={!values.uuid}
            dirty={dirty}
            processing={isSubmitting}
            submitting={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}>
            <Grid container spacing={4}>
                <LeftGrid
                    isDisabled={isDisabled}
                    values={values}
                    setFieldValue={setFieldValue}
                />
                <RightGrid isDisabled={isDisabled} values={values} />
            </Grid>
        </FormikForm>
    )
}

interface InnerGrid {
    isDisabled: boolean
    values: FormData
}

function LeftGrid({
    isDisabled,
    values,
    setFieldValue,
}: InnerGrid & {
    setFieldValue: FormikProps<FormData>['setFieldValue']
}) {
    const [showCashSelect, setShowCashSelect] = useState(!!values.finalized_at)

    return (
        <Grid size={{ xs: 12, sm: 4 }}>
            <DateField name="at" label="Tanggal" disabled={isDisabled} />
            <TextField
                name="note"
                label="Catatan"
                disabled={isDisabled}
                textFieldProps={{
                    required: false,
                    multiline: true,
                }}
            />

            <FormGroup>
                <FormControlLabel
                    disabled={isDisabled}
                    checked={Boolean(values.finalized_at) || showCashSelect}
                    control={
                        <Checkbox
                            onChange={() => {
                                setShowCashSelect(prev => !prev)
                            }}
                        />
                    }
                    label="Simpan Permanen"
                />
            </FormGroup>

            <Fade in={showCashSelect} unmountOnExit>
                <span>
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/cashes"
                        label="Telah dibayar melalui kas"
                        fullWidth
                        required
                        size="small"
                        margin="dense"
                        selectProps={{
                            name: 'cash_uuid',
                            value:
                                values.transaction?.cashable_uuid ??
                                values.cash_uuid,
                        }}
                        onValueChange={(value: CashType) =>
                            setFieldValue('cash_uuid', value.uuid)
                        }
                    />
                </span>
            </Fade>

            <Box mt={4}>
                <FieldArray
                    name="costs"
                    render={props => (
                        <CostsField {...props} isDisabled={isDisabled} />
                    )}
                />
            </Box>
        </Grid>
    )
}

function RightGrid({ isDisabled }: InnerGrid) {
    return (
        <Grid size={{ xs: 12, sm: 8 }}>
            <FieldArray
                name="details"
                render={props => (
                    <DetailsField {...props} isDisabled={isDisabled} />
                )}
            />
        </Grid>
    )
}
