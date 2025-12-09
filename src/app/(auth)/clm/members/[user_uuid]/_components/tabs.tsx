'use client'

// material-labs
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MuiTab from '@mui/material/Tab'
import { useRouter } from 'next/navigation'
// vendors
import { type SyntheticEvent, useState } from 'react'
import type EntryORM from '@/app/(auth)/surveys/_orms/entry'
import DataTable, { type DataTableProps } from '@/components/data-table'
// components
import Fab from '@/components/fab'
import NextLink from '@/components/next-link'
import DownloadRequisiteUserFilesButton from '@/modules/clm/components/download-requisite-user-files-button'
import UserOrLandRequisiteCard from '@/modules/clm/components/user-or-land-requisite-card'
import type UserORM from '@/modules/user/types/orms/user'
import toDmy from '@/utils/to-dmy'
import LandCard from './tabs.land-card'
// modules
import type { ClmMemberDetailResponse } from './use-member-detail-swr'

type TabId = '1' | '2' | 'survey'

export default function Tabs({ data }: { data: ClmMemberDetailResponse }) {
    const [tab, setTab] = useState<TabId>('1')

    function handleChange(_: SyntheticEvent, newValue: TabId) {
        setTab(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={tab}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <MuiTab label="Persyaratan" value="1" />
                        <MuiTab label="Lahan" value="2" />
                        <MuiTab label="Survei" value="survey" />
                    </TabList>
                </Box>

                <TabPanel sx={{ px: 0 }} value="1">
                    <Box mb={2}>
                        <DownloadRequisiteUserFilesButton
                            userUuid={data.user.uuid}
                        />
                    </Box>

                    {data.requisite_users_with_default.map(requisiteUser => (
                        <UserOrLandRequisiteCard
                            data={requisiteUser}
                            key={
                                requisiteUser.uuid ?? requisiteUser.requisite_id
                            }
                        />
                    ))}
                </TabPanel>

                <TabPanel sx={{ px: 0 }} value="2">
                    <Fab
                        component={NextLink}
                        href={`${data.user.uuid}/lands/create`}
                        title="Tambah Lahan"
                    />

                    <Grid container spacing={2}>
                        {data.lands.length === 0 && (
                            <Alert severity="warning">
                                Belum ada data Lahan
                            </Alert>
                        )}

                        {data.lands.map(land => (
                            <Grid key={land.uuid}>
                                <LandCard land={land} />
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>

                <TabPanel sx={{ px: 0 }} value="survey">
                    <SurveyTab userUuid={data.user.uuid} />
                </TabPanel>
            </TabContext>
        </Box>
    )
}

function SurveyTab({ userUuid }: { userUuid: UserORM['uuid'] }) {
    const { push } = useRouter()
    return (
        <Box>
            <DataTable<EntryORM>
                apiUrl={`clm/members/${userUuid}/entries`}
                columns={DATATABLE_COLUMNS}
                defaultSortOrder={{ direction: 'desc', name: 'id' }}
                onRowClick={(row, _, ev) => {
                    ev.preventDefault()

                    if (ev.detail === 2) {
                        push(`/clm/members/${userUuid}/entry/${row[0]}`)
                    }
                }}
                tableId="surveys-table"
            />
        </Box>
    )
}

const DATATABLE_COLUMNS: DataTableProps<EntryORM>['columns'] = [
    {
        label: 'ID',
        name: 'id',
    },
    {
        label: 'Nama',
        name: 'survey.name',
    },
    {
        label: 'Dientri Pada',
        name: 'created_at',
        options: {
            customBodyRender: value => toDmy(value),
        },
    },
]
