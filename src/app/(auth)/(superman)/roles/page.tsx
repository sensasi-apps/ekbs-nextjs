'use client'

import type Role from '@/dataTypes/Role'

import { type FC } from 'react'

import useFormData, { FormDataProvider } from '@/providers/useFormData'

import Datatable, { getRowData, mutate } from '@/components/Datatable'
import FormActions from '@/components/Global/Form/Actions'
import Dialog from '@/components/Global/Dialog'

import RoleForm from '@/components/Role/Form'
import { useRoleChecker } from '@/hooks/use-role-checker'
import RoleEnum from '@/enums/Role'
import PageTitle from '@/components/page-title'

const RolesPage: FC = () => {
    if (!useRoleChecker(RoleEnum.SUPERMAN)) return null

    return (
        <>
            <PageTitle title="Pengaturan Peran" />

            <FormDataProvider>
                <PalmBunchDeliveryRatesCrudWithUseFormData />
            </FormDataProvider>
        </>
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
                        const data = getRowData<Role>(rowIndex)
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
