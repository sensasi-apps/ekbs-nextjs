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
import NextLink from 'next/link'
// vendors
import { type SyntheticEvent, useState } from 'react'
// components
import Fab from '@/components/fab'
import DownloadRequisiteUserFilesButton from '@/modules/clm/components/download-requisite-user-files-button'
import UserOrLandRequisiteCard from '@/modules/clm/components/user-or-land-requisite-card'
import LandCard from './tabs.land-card'
// modules
import type { ClmMemberDetailResponse } from './use-member-detail-swr'

export default function Tabs({ data }: { data: ClmMemberDetailResponse }) {
    const [value, setValue] = useState('1')

    function handleChange(_: SyntheticEvent, newValue: string) {
        setValue(newValue)
    }

    return (
        <Box sx={{ width: '100%' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange}>
                        <MuiTab label="Persyaratan" value="1" />
                        <MuiTab label="Lahan" value="2" />
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
            </TabContext>
        </Box>
    )
}
