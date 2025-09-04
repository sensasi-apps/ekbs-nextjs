'use client'

import { useState, type SyntheticEvent } from 'react'
// materials
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Link from 'next/link'
import MuiTab from '@mui/material/Tab'
// material-labs
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
// components
import Fab from '@/components/Fab'
// modules
import type { ClmMemberDetailResponse } from './use-member-detail-swr'
import LandCard from './tabs.land-card'
import UserRequisiteCard from './tabs.user-requisite-card'

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

                <TabPanel value="1" sx={{ px: 0 }}>
                    {data.requisite_users_with_default.map(requisiteUser => (
                        <UserRequisiteCard
                            key={requisiteUser.requisite_id}
                            requisiteUser={requisiteUser}
                        />
                    ))}
                </TabPanel>

                <TabPanel value="2" sx={{ px: 0 }}>
                    <Fab
                        title="Tambah Lahan"
                        href={data.user.uuid + '/lands/create'}
                        component={Link}
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
