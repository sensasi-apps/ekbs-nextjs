// types
import type { AxiosResponse } from 'axios'
import type InventoryItem from '@/dataTypes/InventoryItem'
import type { MUISortOptions } from 'mui-datatables'
import type { GetRowDataType, MutateType } from '@/components/Datatable'
import type { InventoryItemFormValues } from '@/components/pages/inventory-items/Form'
// vendors
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { Card, CardContent, Grid2 } from '@mui/material'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import InventoryItemFormWithFormik from '@/components/pages/inventory-items/Form/WithFormik'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// components/pages
import AssignPicButtonAndDialogForm from '@/components/pages/inventory-items/[uuid]/AssignPicButtonAndDialogForm'
import ChekupButtonAndDialogForm from '@/components/pages/inventory-items/[uuid]/CheckupButtonAndDialogForm'
import FlexColumnBox from '@/components/FlexColumnBox'
import BackButton from '@/components/BackButton'
import { DataTableColumnObject } from 'mui-datatable-delight'

let picMutator: MutateType<InventoryItem['latest_pic']>
let checkupMutator: MutateType<InventoryItem['latest_checkup']>

let getPicRowData: GetRowDataType<InventoryItem['latest_pic']>
let getCheckupRowData: GetRowDataType<InventoryItem['latest_checkup']>

export default function InventoryItemDetail() {
    const {
        query: { uuid },
        replace,
    } = useRouter()

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

    return (
        <AuthLayout
            title={`${
                inventoryItem && inventoryItem.name
                    ? inventoryItem.name + ' | '
                    : ''
            }Inventaris`}>
            <BackButton />
            {inventoryItem && inventoryItem.uuid ? (
                <Grid2
                    container
                    spacing={2}
                    direction={{
                        xs: 'column-reverse',
                        sm: 'row',
                    }}>
                    <Grid2
                        size={{
                            xs: 12,
                            sm: 8,
                        }}>
                        <ChekupButtonAndDialogForm
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
                                getRowDataCallback={fn =>
                                    (getCheckupRowData = fn)
                                }
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
                    </Grid2>
                    <Grid2
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
                                    }}
                                    onSubmitted={mutate}
                                    onReset={() => null}
                                />
                            </CardContent>
                        </Card>
                    </Grid2>
                </Grid2>
            ) : (
                <LoadingCenter />
            )}
        </AuthLayout>
    )
}

const DEFAULT_SORT_ORDER: MUISortOptions = {
    name: 'at',
    direction: 'desc',
}

const PIC_DATATABLE_COLUMNS: DataTableColumnObject[] = [
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

const CHECKUP_DATATABLE_COLUMNS: DataTableColumnObject[] = [
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
