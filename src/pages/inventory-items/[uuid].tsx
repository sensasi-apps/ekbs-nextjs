// types
import type InventoryItem from '@/dataTypes/InventoryItem'
import type { MUIDataTableColumn, MUISortOptions } from 'mui-datatables'
import type { KeyedMutator } from 'swr'
// vendors
import { useRouter } from 'next/router'
import useSWR from 'swr'
// materials
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid2 from '@mui/material/Unstable_Grid2'
// icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
// components
import AuthLayout from '@/components/Layouts/AuthLayout'
import Datatable from '@/components/Datatable'
import InventoryItemFormWithFormik from '@/components/pages/inventory-items/Form/WithFormik'
import LoadingCenter from '@/components/Statuses/LoadingCenter'
// components/pages
import AssignPicButtonAndDialogForm from '@/components/pages/inventory-items/[uuid]/AssignPicButtonAndDialogForm'
import ChekupButtonAndDialogForm from '@/components/pages/inventory-items/[uuid]/CheckupButtonAndDialogForm'

let picMutator: KeyedMutator<InventoryItem['pics']>
let checkupMutator: KeyedMutator<InventoryItem['checkups']>

let getPicDataByRow: (index: number) => InventoryItem['latest_pic']
let getCheckupDataByRow: (index: number) => InventoryItem['latest_checkup']

export default function InventoryItemDetail() {
    const {
        query: { uuid },
        replace,
        back,
    } = useRouter()

    const { data: inventoryItem, mutate } = useSWR<InventoryItem>(
        uuid ? `/inventory-items/${uuid}` : null,
        {
            onError: err => {
                if (err.response?.status === 404) replace('/404')
            },
        },
    )

    return (
        <AuthLayout
            title={`${
                inventoryItem ? inventoryItem.name + ' | ' : ''
            }Inventaris`}>
            <Button
                style={{
                    marginBottom: '1rem',
                }}
                startIcon={<ArrowBackIcon />}
                onClick={() => back()}
                size="small">
                Kembali
            </Button>
            {inventoryItem ? (
                <Grid2
                    container
                    spacing={2}
                    direction={{
                        xs: 'column-reverse',
                        sm: 'row',
                    }}>
                    <Grid2 xs={12} sm={8}>
                        <ChekupButtonAndDialogForm
                            uuid={inventoryItem.uuid}
                            onSubmit={() => checkupMutator()}
                            latestPic={inventoryItem.latest_pic}
                        />

                        {uuid && (
                            <Box display="flex" flexDirection="column" gap={3}>
                                <Datatable
                                    title="Pemeriksaan"
                                    tableId="inventory-item-checkup-table"
                                    apiUrl={`inventory-items/${uuid}/checkups/datatable`}
                                    columns={CHECKUP_DATATABLE_COLUMNS}
                                    defaultSortOrder={DEFAULT_SORT_ORDER}
                                    mutateCallback={mutate =>
                                        (checkupMutator = mutate)
                                    }
                                    getDataByRowCallback={getDataByRow =>
                                        (getCheckupDataByRow = getDataByRow)
                                    }
                                />

                                <Datatable
                                    title="Penanggung Jawab"
                                    tableId="inventory-item-pic-table"
                                    apiUrl={`inventory-items/${uuid}/pics/datatable`}
                                    columns={PIC_DATATABLE_COLUMNS}
                                    defaultSortOrder={DEFAULT_SORT_ORDER}
                                    mutateCallback={mutate =>
                                        (picMutator = mutate)
                                    }
                                    getDataByRowCallback={getDataByRow =>
                                        (getPicDataByRow = getDataByRow)
                                    }
                                />
                            </Box>
                        )}
                    </Grid2>
                    <Grid2 xs={12} sm={4}>
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
                                    initialValues={inventoryItem}
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

const PIC_DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'at',
        label: 'Pada',
    },
    {
        name: 'pic_user.name',
        label: 'Oleh',
        options: {
            customBodyRenderLite: dataIndex => {
                const { pic_user } = getPicDataByRow(dataIndex) ?? {}
                if (!pic_user) return '-'

                const { id, name } = pic_user

                return `#${id} ${name}`
            },
        },
    },
    {
        name: 'note',
        label: 'Catatan',
    },
]

const CHECKUP_DATATABLE_COLUMNS: MUIDataTableColumn[] = [
    {
        name: 'at',
        label: 'Pada',
    },
    {
        name: 'note',
        label: 'Pemeriksaan',
    },
    {
        name: 'by_user.name',
        label: 'Oleh',
        options: {
            customBodyRenderLite: dataIndex => {
                const { by_user } = getCheckupDataByRow(dataIndex) ?? {}
                if (!by_user) return '-'

                const { id, name } = by_user

                return `#${id} ${name}`
            },
        },
    },
]
