'use client'

// types
import type InventoryItem from '@/types/orms/inventory-item'
import type {
    DatatableProps,
    GetRowDataType,
    MutateType,
} from '@/components/Datatable'
// vendors
import type { AxiosResponse } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import axios from '@/lib/axios'
import useSWR from 'swr'
// materials
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
// components
import BackButton from '@/components/back-button'
import Datatable from '@/components/Datatable'
import FlexColumnBox from '@/components/FlexColumnBox'
import LoadingCenter from '@/components/loading-center'
import PageTitle from '@/components/page-title'
// page components
import type { InventoryItemFormValues } from '@/app/(auth)/inventories/items/[uuid]/_parts/form'
import InventoryItemFormWithFormik from '@/app/(auth)/inventories/items/[uuid]/_parts/form/with-formik'
import AssignPicButtonAndDialogForm from '@/app/(auth)/inventories/items/[uuid]/_parts/assign-pic-button-and-dialog-form'
import CheckupButtonAndDialogForm from '@/app/(auth)/inventories/items/[uuid]/_parts/checkup-button-and-dialog-form'

let picMutator: MutateType<InventoryItem['latest_pic']>
let checkupMutator: MutateType<InventoryItem['latest_checkup']>

let getPicRowData: GetRowDataType<InventoryItem['latest_pic']>
let getCheckupRowData: GetRowDataType<InventoryItem['latest_checkup']>

export default function InventoryItemDetail() {
    const { replace } = useRouter()
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
                if (err.response?.status === 404) replace('/404')
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
                spacing={2}
                direction={{
                    xs: 'column-reverse',
                    sm: 'row',
                }}>
                <Grid
                    size={{
                        xs: 12,
                        sm: 8,
                    }}>
                    <CheckupButtonAndDialogForm
                        uuid={inventoryItem.uuid}
                        onSubmit={() => checkupMutator()}
                        latestPic={inventoryItem.latest_pic}
                    />

                    <FlexColumnBox gap={3}>
                        <Datatable
                            title="Pemeriksaan"
                            tableId="inventory-item-checkup-table"
                            apiUrl={`inventory-items/${inventoryItem.uuid}/checkups/datatable`}
                            columns={CHECKUP_DATATABLE_COLUMNS}
                            defaultSortOrder={DEFAULT_SORT_ORDER}
                            mutateCallback={fn => (checkupMutator = fn)}
                            getRowDataCallback={fn => (getCheckupRowData = fn)}
                        />

                        <Datatable
                            title="Penanggung Jawab"
                            tableId="inventory-item-pic-table"
                            apiUrl={`inventory-items/${inventoryItem.uuid}/pics/datatable`}
                            columns={PIC_DATATABLE_COLUMNS}
                            defaultSortOrder={DEFAULT_SORT_ORDER}
                            mutateCallback={mutate => (picMutator = mutate)}
                            getRowDataCallback={fn => (getPicRowData = fn)}
                        />
                    </FlexColumnBox>
                </Grid>
                <Grid
                    size={{
                        xs: 12,
                        sm: 4,
                    }}>
                    <AssignPicButtonAndDialogForm
                        uuid={inventoryItem.uuid}
                        latestPic={inventoryItem.latest_pic}
                        onSubmit={() => {
                            picMutator()
                            mutate()
                        }}
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
                                    tags: inventoryItem.tags ?? [],
                                    default_rate_unit:
                                        inventoryItem.rentable
                                            ?.default_rate_unit ?? undefined,
                                }}
                                onSubmitted={mutate}
                                onReset={() => null}
                            />
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

const DEFAULT_SORT_ORDER = {
    name: 'at',
    direction: 'desc' as const,
}

const PIC_DATATABLE_COLUMNS: DatatableProps<
    InventoryItem['latest_pic']
>['columns'] = [
    {
        name: 'at',
        label: 'Pada',
    },
    {
        name: 'picUser.name',
        label: 'Oleh',
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

const CHECKUP_DATATABLE_COLUMNS: DatatableProps<
    InventoryItem['latest_checkup']
>['columns'] = [
    {
        name: 'at',
        label: 'Pada',
    },
    {
        name: 'note',
        label: 'Pemeriksaan',
    },
    {
        name: 'byUser.name',
        label: 'Oleh',
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
