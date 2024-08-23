// vendors
import { Box, Dialog, Tab, Tabs } from '@mui/material'
import { useState } from 'react'
// components
import IconButton from '@/components/IconButton'
import Datatable from './HistoryDatatableModalAndButton/Datatable'
// icons
import HistoryIcon from '@mui/icons-material/History'
import BalanceInSummary from './HistoryDatatableModalAndButton/BalanceInSummary'
import SalesReport from './HistoryDatatableModalAndButton/SalesReport'
import useAuth from '@/providers/Auth'
import Mart from '@/enums/permissions/Mart'

export default function HistoryDatatableModalAndButton() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)

    const { userHasPermission } = useAuth()

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <IconButton
                title="Riwayat"
                icon={HistoryIcon}
                onClick={() => setOpen(true)}
            />

            <Dialog
                maxWidth="md"
                fullWidth
                open={open}
                onClose={() => setOpen(false)}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example">
                        <Tab label="Semua" {...a11yProps(0)} />
                        <Tab label="Saldo Masuk" {...a11yProps(1)} />

                        {userHasPermission(Mart.READ_SALE_REPORT) && (
                            <Tab label="Rincian Marjin" {...a11yProps(2)} />
                        )}
                    </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                    <Datatable />
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                    <Box p={4}>
                        <BalanceInSummary />
                    </Box>
                </CustomTabPanel>

                {userHasPermission(Mart.READ_SALE_REPORT) && (
                    <CustomTabPanel value={value} index={2}>
                        <Box p={4}>
                            <SalesReport />
                        </Box>
                    </CustomTabPanel>
                )}
            </Dialog>
        </>
    )
}

interface TabPanelProps {
    children?: React.ReactNode
    index: number
    value: number
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    }
}
