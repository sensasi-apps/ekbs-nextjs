'use client'

// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
//
import PageTitle from '@/components/page-title'
// vendors
import axios from '@/lib/axios'

export default function Page() {
    return (
        <>
            <PageTitle title="BE Request Test" />

            <Box display="flex" gap={2}>
                <Button
                    onClick={() => axios.post('_/fe-integration-test')}
                    size="large"
                    variant="contained">
                    Post to /fe-integration-test
                </Button>

                <Button
                    onClick={() => {
                        throw new Error('Test Sentry Integration')
                    }}
                    size="large"
                    variant="contained">
                    Throw New Error
                </Button>
            </Box>
        </>
    )
}
