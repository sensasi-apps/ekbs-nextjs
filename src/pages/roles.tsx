import type Role from '@/dataTypes/Role'

import { FC } from 'react'

import AuthLayout from '@/components/Layouts/AuthLayout'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

import Datatable, { getDataRow, mutate } from '@/components/Datatable'
import FormActions from '@/components/Global/Form/Actions'
import Dialog from '@/components/Global/Dialog'

import RoleForm from '@/components/Role/Form'

const RolesPage: FC = () => {
    return (
        <AuthLayout title="Peran">
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
        formOpen,
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
                onRowClick={(_, { rowIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getDataRow<Role>(rowIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                columns={columns}
                defaultSortOrder={{ name: 'name', direction: 'asc' }}
            />

            <Dialog
                open={formOpen}
                title={'Perbaharui Data Peran'}
                maxWidth="sm"
                closeButtonProps={{
                    onClick: handleClose,
                    disabled: loading,
                }}>
                <RoleForm
                    data={data as Role}
                    loading={loading}
                    setSubmitting={setSubmitting}
                    onSubmitted={async () => {
                        await mutate()
                        handleClose()
                        setSubmitting(false)
                    }}
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                />
            </Dialog>
        </>
    )
}

export default RolesPage
