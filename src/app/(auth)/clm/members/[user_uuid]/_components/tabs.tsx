import { useState, type SyntheticEvent } from 'react'
// materials
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MuiTab from '@mui/material/Tab'
// material-labs
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
// features
import type ApiResponse from '../_types/api-response'
import LandCard from './tabs.land-card'
import UserRequisiteCard from './tabs.user-requisite-card'

export default function Tabs({ data }: { data: ApiResponse }) {
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
                    {data.requisite_users.map(requisiteUser => (
                        <UserRequisiteCard
                            key={requisiteUser.requisite_id}
                            requisiteUser={requisiteUser}
                        />
                    ))}
                </TabPanel>

                <TabPanel value="2" sx={{ px: 0 }}>
                    <Grid container>
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
