// vendors
import axios from '@/lib/axios'
// materials
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
//
import PageTitle from '@/components/page-title'

export default function Page() {
    return (
        <>
            <PageTitle title="BE Request Test" />

            <Box display="flex" gap={2}>
                <Button
                    size="large"
                    variant="contained"
                    onClick={() => axios.post('_/fe-integration-test')}>
                    Post to /fe-integration-test
                </Button>

                <Button
                    size="large"
                    variant="contained"
                    onClick={() => {
                        throw new Error('Test Sentry Integration')
                    }}>
                    Throw New Error
                </Button>
            </Box>
        </>
    )
}
