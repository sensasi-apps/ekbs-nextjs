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
import { isAxiosError } from 'axios'
import { FieldArray, Formik, type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import DateField from '@/components/formik-fields/date-field'
import TextField from '@/components/formik-fields/text-field'
// components
import FormikForm from '@/components/formik-form'
import SelectFromApi from '@/components/Global/SelectFromApi'
// utils
import myAxios from '@/lib/axios'
import DeletePurchaseButton from '@/modules/repair-shop/components/delete-purchase-button'
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
    onDeleted,
}: {
    formData: FormData | undefined
    handleClose: () => void
    onDeleted?: () => void
}) {
    const isNew = !formData?.uuid
    const [deleting, setDeleting] = useState(false)
    const [saving, setSaving] = useState(false)
    const deletingRef = useRef(false)
    const savingRef = useRef(false)

    function onDeletingChange(value: boolean) {
        deletingRef.current = value
        setDeleting(value)
    }

    return (
        <Dialog disablePortal fullScreen open>
            <DialogTitle>
                {isNew ? 'Tambah' : 'Ubah'} Data Pembelian
            </DialogTitle>

            <DialogContent>
                <Formik<FormData>
                    initialValues={formData ?? {}}
                    onReset={() => {
                        if (!deletingRef.current && !savingRef.current)
                            handleClose()
                    }}
                    onSubmit={async (values, { setErrors, resetForm }) => {
                        if (
                            deletingRef.current ||
                            savingRef.current ||
                            values.finalized_at
                        )
                            return
                        savingRef.current = true
                        setSaving(true)
                        const request = isNew
                            ? myAxios.post(Endpoint.CREATE, values)
                            : myAxios.put(
                                  Endpoint.UPDATE.replace(
                                      '$1',
                                      values?.uuid ?? '',
                                  ),
                                  values,
                              )

                        try {
                            await request
                            savingRef.current = false
                            resetForm()
                        } catch (error) {
                            if (!isAxiosError(error)) throw error
                            handle422(error, setErrors)
                        } finally {
                            savingRef.current = false
                            setSaving(false)
                        }
                    }}
                    validateOnChange={false}>
                    {props => (
                        <PurchaseFormikForm
                            {...props}
                            deleting={deleting}
                            onDeleted={onDeleted ?? handleClose}
                            onDeletingChange={onDeletingChange}
                            saving={saving}
                        />
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

function PurchaseFormikForm({
    dirty,
    setFieldValue,
    isSubmitting,
    values,
    deleting,
    saving,
    onDeleted,
    onDeletingChange,
}: FormikProps<FormData> & {
    deleting: boolean
    saving: boolean
    onDeleted: () => void
    onDeletingChange: (deleting: boolean) => void
}) {
    const isDisabled =
        isSubmitting || saving || deleting || !!values.finalized_at

    return (
        <FormikForm
            autoComplete="off"
            dirty={dirty}
            id="spare-part-purchase-form"
            isNew={!values.uuid}
            processing={isSubmitting || saving || deleting}
            slotProps={{
                submitButton: {
                    disabled: isDisabled,
                },
            }}
            submitting={isSubmitting}>
            {values.uuid && (
                <Box mb={2}>
                    <DeletePurchaseButton
                        disabled={isSubmitting || saving || deleting}
                        onDeleted={onDeleted}
                        onDeletingChange={onDeletingChange}
                        purchaseUuid={values.uuid}
                    />
                </Box>
            )}
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
