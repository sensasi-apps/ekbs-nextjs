import { FC } from 'react'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import AuthLayout from '@/components/Layouts/AuthLayout'

import useFormData, { FormDataProvider } from '@/providers/useFormData'
import Datatable, { getDataRow } from '@/components/Global/Datatable'
import FormActionsBox from '@/components/Global/FormActionsBox'
import { mutate } from 'swr'
import RoleForm from '@/components/Role/Form'
import Role from '@/dataTypes/Role'

const DialogWithUseFormData = dynamic(
    () => import('@/components/Global/Dialog/WithUseFormData'),
)

const RolesPage: FC = () => {
    return (
        <AuthLayout title="Peran">
            <Head>
                <title>{`Peran — ${process.env.NEXT_PUBLIC_APP_NAME}`}</title>
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
        data,
        handleClose,
        submitting,
        setSubmitting,
        loading,
    } = useFormData()

    const columns = [
        {
            name: 'id',
        },
        {
            name: 'name',
        },
        {
            name: 'name_id',
        },
        {
            name: 'group',
        },
    ]

    return (
        <>
            <Datatable
                tableId="roles-datatable"
                apiUrl="/roles/datatable"
                onRowClick={(rowData, rowMeta) =>
                    handleEdit(getDataRow(rowMeta.rowIndex))
                }
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
            />

            <DialogWithUseFormData
                title={'Perbaharui Data Peran'}
                maxWidth="sm">
                <RoleForm
                    data={data as Role}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    handleClose={async () => {
                        await mutate('/roles/datatable')
                        handleClose()
                        setSubmitting(false)
                    }}
                    actionsSlot={
                        <FormActionsBox
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </DialogWithUseFormData>
        </>
    )
}

export default RolesPage
