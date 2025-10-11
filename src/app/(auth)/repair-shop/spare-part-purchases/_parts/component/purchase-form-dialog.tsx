// vendors

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
import { FieldArray, Formik, type FormikProps } from 'formik'
import { useState } from 'react'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
// utils
import myAxios from '@/lib/axios'
// feature scope
import type SparePartMovement from '@/modules/repair-shop/types/orms/spare-part-movement'
import type CashType from '@/types/orms/cash'
import handle422 from '@/utils/handle-422'
import Endpoint from '../enums/endpoint'
import CostsField from './costs-field'
import DetailsField from './details-field'

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
        <Dialog disablePortal fullScreen open>
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Pembelian
            </DialogTitle>

            <DialogContent>
                <Formik<FormData>
                    component={PurchaseFormikForm}
                    initialValues={formData ?? {}}
                    onReset={handleClose}
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
                    validateOnChange={false}
                />
            </DialogContent>
        </Dialog>
    )
}

function PurchaseFormikForm({
    dirty,
    setFieldValue,
    isSubmitting,
    values,
}: FormikProps<FormData>) {
    const isDisabled = isSubmitting || !!values.finalized_at

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="spare-part-purchase-form"
            isNew={!values.uuid}
            processing={isSubmitting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            <Grid container spacing={4}>
                <LeftGrid
                    isDisabled={isDisabled}
                    setFieldValue={setFieldValue}
                    values={values}
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
        <Grid size={{ sm: 4, xs: 12 }}>
            <DateField disabled={isDisabled} label="Tanggal" name="at" />
            <TextField
                disabled={isDisabled}
                label="Catatan"
                name="note"
                textFieldProps={{
                    multiline: true,
                    required: false,
                }}
            />

            <FormGroup>
                <FormControlLabel
                    checked={Boolean(values.finalized_at) || showCashSelect}
                    control={
                        <Checkbox
                            onChange={() => {
                                setShowCashSelect(prev => !prev)
                            }}
                        />
                    }
                    disabled={isDisabled}
                    label="Simpan Permanen"
                />
            </FormGroup>

            <Fade in={showCashSelect} unmountOnExit>
                <span>
                    <SelectFromApi
                        disabled={isDisabled}
                        endpoint="/data/cashes"
                        fullWidth
                        label="Telah dibayar melalui kas"
                        margin="dense"
                        onValueChange={(value: CashType) =>
                            setFieldValue('cash_uuid', value.uuid)
                        }
                        required
                        selectProps={{
                            name: 'cash_uuid',
                            value:
                                values.transaction?.cashable_uuid ??
                                values.cash_uuid ??
                                '',
                        }}
                        size="small"
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
        <Grid size={{ sm: 8, xs: 12 }}>
            <FieldArray
                name="details"
                render={props => (
                    <DetailsField {...props} isDisabled={isDisabled} />
                )}
            />
        </Grid>
    )
}
