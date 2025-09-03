'use client'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

export default function PalmBunchesRates() {
    return (
        <>
            <PageTitle title="Harga Sawit" />

            <FormDataProvider>
                <Crud />
            </FormDataProvider>
        </>
    )
}

// types
import type { PalmBunchRateType } from '@/dataTypes/PalmBunchRate'
import type PalmBunchRateValidDateType from '@/types/orms/palm-bunch-rate-valid-date'
// vendors
import Fab from '@mui/material/Fab'
import SellIcon from '@mui/icons-material/Sell'
// components
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import PalmBunchRatesForm from '@/components/PalmBunchRates/Form'
// utils
import toDmy from '@/utils/to-dmy'
import numberToCurrency from '@/utils/number-to-currency'
import PageTitle from '@/components/page-title'

function Crud() {
    const {
        formOpen,
        handleClose,
        handleCreate,
        handleEdit,
        isNew,
        isDirty,
        loading,
    } = useFormData<PalmBunchRateValidDateType>()

    const columns = [
        {
            name: 'id',
            label: 'NO',
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
            name: 'rates',
            label: 'Harga',
            searchable: false,
            options: {
                searchable: false,
                sort: false,
                customBodyRender: (value: PalmBunchRateType[]) =>
                    value[0].rp_per_kg
                        ? numberToCurrency(value[0].rp_per_kg)
                        : '-',
            },
        },
    ]

    return (
        <>
            <Datatable
                apiUrl="/palm-bunches/rates/datatable"
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
                onRowClick={(_, { rowIndex }, event) => {
                    if (event.detail === 2) {
                        const data =
                            getRowData<PalmBunchRateValidDateType>(rowIndex)
                        if (!data) return

                        handleEdit(data)
                    }
                }}
                tableId="PalmBunchRateValidDate"
                title="Daftar Harga TBS"
            />
            <Dialog
                title={isNew ? 'Harga Baru' : 'Ubah Harga'}
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
                <PalmBunchRatesForm parentDatatableMutator={mutate} />
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
