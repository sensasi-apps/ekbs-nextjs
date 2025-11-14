'use client'

import SellIcon from '@mui/icons-material/Sell'
import Fab from '@mui/material/Fab'
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import type PalmBunchDeliveryRateORM from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate'
import type PalmBunchDeliveryRateValidDateType from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate-valid-date'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
import PalmBunchDeliveryRatesForm from './palm-bunch-delivery-rates-form'

export default function Crud() {
    return (
        <FormDataProvider>
            <Inner />
        </FormDataProvider>
    )
}

function Inner() {
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

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/delivery-rates/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchDeliveryRateValidDateType>(
                                dataIndex,
                            )

                        if (data) {
                            handleEdit(data)
                        }
                    }
                }}
                tableId="PalmBunchDeliveryRateDatatable"
                title="Daftar Tarif Angkut"
            />
            <Dialog
                closeButtonProps={{
                    disabled: loading,
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
                }}
                maxWidth="md"
                open={formOpen}
                title={isNew ? 'Tarif Baru' : 'Ubah Tarif'}>
                <PalmBunchDeliveryRatesForm
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
                    data={data}
                    loading={loading}
                    onChange={setData}
                    onSubmitted={async () => {
                        await mutate()
                        setSubmitting(false)
                        handleClose()
                    }}
                    setSubmitting={setSubmitting}
                />
            </Dialog>
            <Fab
                color="success"
                disabled={formOpen}
                onClick={handleCreate}
                sx={{
                    bottom: 16,
                    position: 'fixed',
                    right: 16,
                }}>
                <SellIcon />
            </Fab>
        </>
    )
}

const DATATABLE_COLUMNS = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'Nama',
        name: 'for_human_name',
    },
    {
        label: 'Tanggal Berlaku',
        name: 'valid_from',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Tanggal Berakhir',
        name: 'valid_until',
        options: {
            customBodyRender: toDmy,
        },
    },
    {
        label: 'Harga',
        name: 'delivery_rates',
        options: {
            customBodyRender: (rates: PalmBunchDeliveryRateORM[]) => (
                <ul
                    style={{
                        margin: 0,
                        paddingLeft: '1em',
                    }}>
                    {rates.map(rate => (
                        <li key={rate.id}>
                            {rate.to_oil_mill_code} {rate.from_position}:{' '}
                            {numberToCurrency(rate.rp_per_kg)}
                        </li>
                    ))}
                </ul>
            ),
            searchable: false,
            sort: false,
        },
        searchable: false,
    },
]
