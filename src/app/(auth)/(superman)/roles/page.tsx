'use client'

import RoleForm from '@/app/(auth)/(superman)/roles/role-form'
import Datatable, { getRowData, mutate } from '@/components/Datatable'
import Dialog from '@/components/Global/Dialog'
import FormActions from '@/components/Global/Form/Actions'
import PageTitle from '@/components/page-title'
import useFormData, { FormDataProvider } from '@/providers/useFormData'
import type Role from '@/types/orms/role'

export default function Page() {
    return (
        <>
            <PageTitle title="Pengaturan Peran" />

            <FormDataProvider>
                <CrudForm />
            </FormDataProvider>
        </>
    )
}

function CrudForm() {
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
                apiUrl="/roles/datatable"
                columns={columns}
                defaultSortOrder={{ direction: 'asc', name: 'name' }}
                onRowClick={(_, { rowIndex }, event) => {
                    if (event.detail === 2) {
                        const data = getRowData<Role>(rowIndex)
                        if (!data) return

                        return handleEdit(data)
                    }
                }}
                tableId="roles-datatable"
            />

            <Dialog
                closeButtonProps={{
                    disabled: loading,
                    onClick: handleClose,
                }}
                maxWidth="sm"
                open={formOpen}
                title={'Perbaharui Data Peran'}>
                <RoleForm
                    actionsSlot={
                        <FormActions
                            onCancel={handleClose}
                            submitting={submitting}
                        />
                    }
                    data={data as Role}
                    loading={loading}
                    onSubmitted={async () => {
                        await mutate()
                        handleClose()
                        setSubmitting(false)
                    }}
                    setSubmitting={setSubmitting}
                />
            </Dialog>
        </>
    )
}
