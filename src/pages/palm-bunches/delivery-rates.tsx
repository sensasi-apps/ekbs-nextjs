import moment from 'moment'

import AuthLayout from '@/components/Layouts/AuthLayout'

import { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesDeliveryRates() {
    return (
        <AuthLayout title="Tarif Angkut">
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </AuthLayout>
    )
}

import { NumericFormat } from 'react-number-format'

import Fab from '@mui/material/Fab'

import SellIcon from '@mui/icons-material/Sell'

import useFormData from '@/providers/useFormData'

import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import FormDataDraftsCrud from '@/components/Global/FormDataDraftsCrud'
import PalmBunchDeliveryRatesForm from '@/components/PalmBunchDeliveryRates/Form'
import weekOfMonths from '@/lib/weekOfMonth'
import PalmBunchDeliveryRateValidDateType from '@/dataTypes/PalmBunchDeliveryRateValidDate'
import { dbPromise } from '@/lib/idb'
import PalmBunchDeliveryRateType from '@/dataTypes/PalmBunchDeliveryRate'

const nameIdFormatter = (validFrom: string) => {
    const momentValue = moment(validFrom)

    return `${momentValue.format('MMMM ')}#${weekOfMonths(momentValue)}`
}

const Crud = () => {
    const {
        data,
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isNew,
        isDirty,
        loading,
        setData,
        setSubmitting,
        submitting,
    } = useFormData<PalmBunchDeliveryRateValidDateType>()

    const columns = [
        {
            name: 'id',
            label: 'ID',
        },
        {
            name: 'for_human_name',
            label: 'Nama',
        },
        {
            name: 'valid_from',
            label: 'Tanggal Berlaku',
            options: {
                customBodyRender: (value: Date) =>
                    moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'valid_until',
            label: 'Tanggal Berakhir',
            options: {
                customBodyRender: (value: Date) =>
                    moment(value).format('DD MMMM YYYY'),
            },
        },
        {
            name: 'delivery_rates',
            label: 'Harga',
            searchable: false,
            options: {
                searchable: false,
                sort: false,
                customBodyRender: (rates: PalmBunchDeliveryRateType[]) => (
                    <ul
                        style={{
                            margin: 0,
                        }}>
                        {rates.map(rate => (
                            <li key={rate.id}>
                                {rate.to_oil_mill_code} {rate.from_position}:
                                <NumericFormat
                                    value={rate.rp_per_kg}
                                    prefix=" Rp "
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    displayType="text"
                                />
                            </li>
                        ))}
                    </ul>
                ),
            },
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/delivery-rates/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
                onRowClick={(_, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                tableId="PalmBunchDeliveryRateDatatable"
                title="Daftar Tarif Angkut"
            />
            <Dialog
                title={isNew ? 'Tarif Baru' : 'Ubah Tarif'}
                maxWidth="md"
                open={formOpen}
                closeButtonProps={{
                    onClick: () => {
                        if (
                            isDirty &&
                            !window.confirm(
                                'Perubahan belum tersimpan, yakin ingin menutup?',
                            )
                        ) {
                            return
                        }

                        return handleClose()
                    },
                    disabled: loading,
                }}
                middleHead={
                    <FormDataDraftsCrud
                        modelName="PalmBundleDeliveryRateValidDate"
                        dataKeyForNameId="valid_from"
                        nameIdFormatter={nameIdFormatter}
                    />
                }>
                <PalmBunchDeliveryRatesForm
                    data={data}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onChange={setData}
                    onSubmitted={async payload => {
                        await mutate()
                        setSubmitting(false)
                        handleClose()

                        if (payload?.valid_from) {
                            dbPromise.then(db =>
                                db
                                    .getKeyFromIndex(
                                        'formDataDrafts',
                                        'nameId',
                                        [
                                            'PalmBundleDeliveryRateValidDate',
                                            nameIdFormatter(
                                                payload.valid_from as string,
                                            ),
                                        ],
                                    )
                                    .then(id =>
                                        id
                                            ? db.delete('formDataDrafts', id)
                                            : null,
                                    ),
                            )
                        }
                    }}
                    actionsSlot={
                        <FormActions
                            onCancel={() => {
                                if (
                                    isDirty &&
                                    !window.confirm(
                                        'Perubahan belum tersimpan, yakin ingin membatalkan?',
                                    )
                                ) {
                                    return
                                }

                                return handleClose()
                            }}
                            submitting={submitting}
                        />
                    }
                />
            </Dialog>
            <Fab
                disabled={formOpen}
                onClick={handleCreate}
                color="success"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}>
                <SellIcon />
            </Fab>
        </>
    )
}
