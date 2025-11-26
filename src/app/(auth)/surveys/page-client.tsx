'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import DataTable, { type DataTableProps } from '@/components/data-table'
import DialogFormik from '@/components/dialog-formik'
import Fab from '@/components/fab'
import toDmy from '@/utils/to-dmy'
import type SurveyORM from './_orms/survey'
import FormFields from './form-fields'

export default function PageClient() {
    const { push } = useRouter()
    const [formValues, setFormValues] = useState<Partial<SurveyORM> | null>(
        null,
    )
    const getRowData = useRef<((number: number) => SurveyORM) | null>(null)

    return (
        <>
            <DataTable<SurveyORM>
                apiUrl="/surveys/data-table"
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                getRowDataCallback={fn => {
                    getRowData.current = fn
                }}
                onRowClick={(row, _, ev) => {
                    ev.preventDefault()

                    if (ev.detail === 2) {
                        push(`/surveys/${row[0]}`)
                    }
                }}
                tableId="surveys-table"
            />

            <DialogFormik
                axiosConfig={{
                    method: formValues?.id ? 'PUT' : 'POST',
                    url: formValues?.id
                        ? `/surveys/${formValues.id}`
                        : '/surveys/create',
                }}
                formFields={FormFields}
                initialValues={formValues}
                onReset={() => {
                    setFormValues(null)
                }}
                onSubmitted={response => {
                    push(`/surveys/${response.data.id}`)
                }}
                title={formValues?.id ? 'Edit Survei' : 'Buat Survei'}
            />

            <Fab
                onClick={() => {
                    setFormValues({})
                }}
            />
        </>
    )
}

const DATATABLE_COLUMNS: DataTableProps<SurveyORM>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'Nama',
        name: 'name',
    },
    {
        label: 'Dibuat Pada',
        name: 'created_at',
        options: {
            customBodyRender: value => toDmy(value),
        },
    },
]
