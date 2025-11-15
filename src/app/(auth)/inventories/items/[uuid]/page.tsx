'use client'

// materials
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
// vendors
import type { AxiosResponse } from 'axios'
import { notFound, useParams } from 'next/navigation'
import useSWR from 'swr'
import AssignPicButtonAndDialogForm from '@/app/(auth)/inventories/items/[uuid]/_parts/assign-pic-button-and-dialog-form'
import CheckupButtonAndDialogForm from '@/app/(auth)/inventories/items/[uuid]/_parts/checkup-button-and-dialog-form'
// page components
import type { InventoryItemFormValues } from '@/app/(auth)/inventories/items/[uuid]/_parts/form'
import InventoryItemFormWithFormik from '@/app/(auth)/inventories/items/[uuid]/_parts/form/with-formik'
// components
import BackButton from '@/components/back-button'
import type {
    DataTableProps,
    GetRowDataType,
    MutateType,
} from '@/components/data-table'
import Datatable from '@/components/data-table'
import FlexColumnBox from '@/components/flex-column-box'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
import axios from '@/lib/axios'
// types
import type InventoryItem from '@/types/orms/inventory-item'

let picMutator: MutateType<InventoryItem['latest_pic']>
let checkupMutator: MutateType<InventoryItem['latest_checkup']>

let getPicRowData: GetRowDataType<InventoryItem['latest_pic']>
let getCheckupRowData: GetRowDataType<InventoryItem['latest_checkup']>

export default function InventoryItemDetail() {
    const param = useParams()
    const uuid = param?.uuid as string

    const { data: inventoryItem, mutate } = useSWR<InventoryItemFormValues>(
        uuid ? `/inventory-items/${uuid}` : null,
        (url: string) =>
            axios.get(url).then((res: AxiosResponse<InventoryItem>) => ({
                ...res.data,
                tags: res.data.tags.map(tag => tag.name.id),
            })),
        {
            onError: err => {
                if (err.response?.status === 404) notFound()
            },
        },
    )

    if (!inventoryItem || !inventoryItem.name || !inventoryItem.uuid)
        return <LoadingCenter />

    return (
        <>
            <BackButton />

            <PageTitle title={inventoryItem.name} />

            <Grid
                container
                direction={{
                    sm: 'row',
                    xs: 'column-reverse',
                }}
                spacing={2}>
                <Grid
                    size={{
                        sm: 8,
                        xs: 12,
                    }}>
                    <CheckupButtonAndDialogForm
                        latestPic={inventoryItem.latest_pic}
                        onSubmit={() => checkupMutator()}
                        uuid={inventoryItem.uuid}
                    />

                    <FlexColumnBox gap={3}>
                        <Datatable
                            apiUrl={`inventory-items/${inventoryItem.uuid}/checkups/datatable`}
                            columns={CHECKUP_DATATABLE_COLUMNS}
                            defaultSortOrder={DEFAULT_SORT_ORDER}
                            getRowDataCallback={fn => (getCheckupRowData = fn)}
                            mutateCallback={fn => (checkupMutator = fn)}
                            tableId="inventory-item-checkup-table"
                            title="Pemeriksaan"
                        />

                        <Datatable
                            apiUrl={`inventory-items/${inventoryItem.uuid}/pics/datatable`}
                            columns={PIC_DATATABLE_COLUMNS}
                            defaultSortOrder={DEFAULT_SORT_ORDER}
                            getRowDataCallback={fn => (getPicRowData = fn)}
                            mutateCallback={mutate => (picMutator = mutate)}
                            tableId="inventory-item-pic-table"
                            title="Penanggung Jawab"
                        />
                    </FlexColumnBox>
                </Grid>
                <Grid
                    size={{
                        sm: 4,
                        xs: 12,
                    }}>
                    <AssignPicButtonAndDialogForm
                        latestPic={inventoryItem.latest_pic}
                        onSubmit={() => {
                            picMutator()
                            mutate()
                        }}
                        uuid={inventoryItem.uuid}
                    />

                    <Card
                        style={{
                            position: 'relative',
                        }}>
                        <CardContent>
                            <InventoryItemFormWithFormik
                                initialValues={{
                                    ...inventoryItem,
                                    default_rate_rp_per_unit:
                                        inventoryItem.rentable
                                            ?.default_rate_rp_per_unit ??
                                        undefined,
                                    default_rate_unit:
                                        inventoryItem.rentable
                                            ?.default_rate_unit ?? undefined,
                                    tags: inventoryItem.tags ?? [],
                                }}
                                onReset={() => null}
                                onSubmitted={mutate}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

const DEFAULT_SORT_ORDER = {
    direction: 'desc' as const,
    name: 'at',
}

const PIC_DATATABLE_COLUMNS: DataTableProps<
    InventoryItem['latest_pic']
>['columns'] = [
    {
        label: 'Pada',
        name: 'at',
    },
    {
        label: 'Oleh',
        name: 'picUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { pic_user } = getPicRowData(dataIndex) ?? {}
                if (!pic_user) return '-'

                const { id, name } = pic_user

                return `#${id} ${name}`
            },
        },
    },
]

const CHECKUP_DATATABLE_COLUMNS: DataTableProps<
    InventoryItem['latest_checkup']
>['columns'] = [
    {
        label: 'Pada',
        name: 'at',
    },
    {
        label: 'Pemeriksaan',
        name: 'note',
    },
    {
        label: 'Oleh',
        name: 'byUser.name',
        options: {
            customBodyRenderLite: dataIndex => {
                const { by_user } = getCheckupRowData(dataIndex) ?? {}
                if (!by_user) return '-'

                const { id, name } = by_user

                return `#${id} ${name}`
            },
        },
    },
]
