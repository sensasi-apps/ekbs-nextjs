'use client'

// icons
import SellIcon from '@mui/icons-material/Sell'
// materials
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
// vendors
import { Formik } from 'formik'
import { useRef, useState } from 'react'
// components
import Datatable, {
    type GetRowDataType,
    type MutateType,
} from '@/components/data-table'
import Fab from '@/components/fab'
// libs
import axios from '@/lib/axios'
// modules
import type PalmBunchDeliveryRateValidDateORM from '@/modules/palm-bunch/types/orms/palm-bunch-delivery-rate-valid-date'
// utils
import handle422 from '@/utils/handle-422'
import numberToCurrency from '@/utils/number-to-currency'
import toDmy from '@/utils/to-dmy'
// local components
import PalmBunchDeliveryRatesForm from './palm-bunch-delivery-rates-form'

const oilMillCodes = ['COM', 'POM', 'SOM'] as const
const categories = ['Atas', 'Bawah', 'Tengah'] as const

const emptyDeliveryRates: PalmBunchDeliveryRateValidDateORM['delivery_rates'] =
    oilMillCodes.reduce(
        (
            acc: PalmBunchDeliveryRateValidDateORM['delivery_rates'],
            millCode,
        ) => {
            categories.forEach(category => {
                acc.push({
                    from_position: category,
                    to_oil_mill_code: millCode,
                } as PalmBunchDeliveryRateValidDateORM['delivery_rates'][number])
            })

            return acc
        },
        [],
    )

export default function Crud() {
    const mutate = useRef<MutateType<PalmBunchDeliveryRateValidDateORM>>(null)
    const getRowData =
        useRef<GetRowDataType<PalmBunchDeliveryRateValidDateORM>>(null)

    const [formData, setFormData] = useState<
        PalmBunchDeliveryRateValidDateORM | undefined
    >(undefined)

    const isNew = !formData?.id
    const formOpen = Boolean(formData)

    const handleClose = () => setFormData(undefined)
    const handleCreate = () => {
        setFormData({
            delivery_rates: emptyDeliveryRates,
        } as PalmBunchDeliveryRateValidDateORM)
    }

    return (
        <>
            <Datatable<PalmBunchDeliveryRateValidDateORM>
                apiUrl="/palm-bunches/delivery-rates/datatable"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                getRowDataCallback={fn => {
                    getRowData.current = fn
                }}
                mutateCallback={fn => {
                    mutate.current = fn
                }}
                onRowClick={(_, { dataIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData.current?.(dataIndex)

                        if (data) {
                            setFormData(data)
                        }
                    }
                }}
                tableId="PalmBunchDeliveryRateDatatable"
                title="Daftar Tarif Angkut"
            />

            <Dialog maxWidth="md" open={formOpen}>
                <DialogTitle>{isNew ? 'Tarif Baru' : 'Ubah Tarif'}</DialogTitle>
                <DialogContent>
                    <Formik<PalmBunchDeliveryRateValidDateORM>
                        component={PalmBunchDeliveryRatesForm}
                        enableReinitialize
                        initialValues={
                            formData ??
                            ({
                                delivery_rates: emptyDeliveryRates,
                            } as PalmBunchDeliveryRateValidDateORM)
                        }
                        onReset={handleClose}
                        onSubmit={async (values, { setErrors }) => {
                            const payload = {
                                delivery_rates: values.delivery_rates,
                                valid_from: values.valid_from,
                                valid_until: values.valid_until,
                            }

                            return axios
                                .post(
                                    `/palm-bunches/delivery-rates${values.id ? '/' + values.id : ''}`,
                                    payload,
                                )
                                .then(async () => {
                                    await mutate.current?.()
                                    handleClose()
                                })
                                .catch(error => handle422(error, setErrors))
                        }}
                    />
                </DialogContent>
            </Dialog>

            <Fab Icon={SellIcon} in onClick={handleCreate} />
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
            customBodyRender: (
                rates: PalmBunchDeliveryRateValidDateORM['delivery_rates'],
            ) => (
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
