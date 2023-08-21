import { FC } from 'react'
import Head from 'next/head'

import AuthLayout from '@/components/Layouts/AuthLayout'

import useFormData, { FormDataProvider } from '@/providers/useFormData2'
import FabWithUseFormData from '@/components/Global/Fab/WithUseFormData'
import SellIcon from '@mui/icons-material/Sell'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import moment from 'moment'
import DialogWithUseFormData from '@/components/Global/Dialog/WithUseFormData'
import PalmBunchDeliveryRatesForm from '@/components/PalmBunchDeliveryRates/Form'
import FormActionsBox from '@/components/Global/FormActionsBox'

const PalmBuncesDeliveryRatesPage: FC = () => {
    return (
        <AuthLayout title="Tarif Pengantaran">
            <Head>
                <title>{`Tarif Pengantaran — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
            </Head>

            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </AuthLayout>
    )
}

const PalmBunchDeliveryRatesCrudWithUseFormData: FC = () => {
    const {
        handleEdit,
        isNew,
        data,
        handleClose,
        submitting,
        setSubmitting,
        loading,
    } = useFormData()

    const title = isNew ? 'Tarif Baru' : 'Ubah Tarif'

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
    ]

    return (
        <>
            <Datatable
                title="Daftar Tarif Pengantaran"
                tableId="PalmBunchDeliveryRateDatatable"
                apiUrl="/palm-bunches/delivery-rates/datatable"
                onRowClick={(rowData, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                columns={columns}
                defaultSortOrder={{ name: 'id', direction: 'desc' }}
            />

            <DialogWithUseFormData title={title} maxWidth="md">
                <PalmBunchDeliveryRatesForm
                    data={data}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    handleClose={handleClose}
                    actionsSlot={
                        <FormActionsBox
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </DialogWithUseFormData>

            <FabWithUseFormData>
                <SellIcon />
            </FabWithUseFormData>
        </>
    )
}

export default PalmBuncesDeliveryRatesPage
