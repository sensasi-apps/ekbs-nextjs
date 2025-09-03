'use client'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

export default function PalmBuncesDeliveryRates() {
    return (
        <>
            <PageTitle title="Tarif Angkut" />
            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </>
    )
}

// types
import type PalmBunchDeliveryRateValidDateType from '@/types/orms/palm-bunch-delivery-rate-valid-date'
import type { PalmBunchDeliveryRateType } from '@/dataTypes/PalmBunchDeliveryRate'
// vendors
import Fab from '@mui/material/Fab'
import SellIcon from '@mui/icons-material/Sell'

// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import PalmBunchDeliveryRatesForm from '@/components/PalmBunchDeliveryRates/Form'
// utils
import toDmy from '@/utils/to-dmy'
import numberToCurrency from '@/utils/number-to-currency'
import PageTitle from '@/components/page-title'

function Crud() {
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
                customBodyRender: toDmy,
            },
        },
        {
            name: 'valid_until',
            label: 'Tanggal Berakhir',
            options: {
                customBodyRender: toDmy,
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
            },
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/delivery-rates/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
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
                }}>
                <PalmBunchDeliveryRatesForm
                    data={data}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onChange={setData}
                    onSubmitted={async () => {
                        await mutate()
                        setSubmitting(false)
                        handleClose()
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
