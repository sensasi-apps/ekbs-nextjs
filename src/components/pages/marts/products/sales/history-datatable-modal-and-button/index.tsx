'use client'

// icons-materials
import HistoryIcon from '@mui/icons-material/History'
// materials
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
// vendors
import { useState } from 'react'
// components
import IconButton from '@/components/IconButton'
// enums
import Mart from '@/enums/permissions/Mart'
// hooks
import useIsAuthHasPermission from '@/hooks/use-is-auth-has-permission'
import BalanceInSummary from './components/balance-in-summary'
import Datatable from './components/datatable'
import SalesReport from './components/sales-report'

export default function HistoryDatatableModalAndButton() {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(0)

    const isAuthHasPermission = useIsAuthHasPermission()

    const handleChange = (_: unknown, newValue: number) => {
        setValue(newValue)
    }

    return (
        <>
            <IconButton
                icon={HistoryIcon}
                onClick={() => setOpen(true)}
                size="medium"
                title="Riwayat"
            />

            <Dialog
                aria-modal="true"
                fullWidth
                maxWidth="md"
                onClose={() => setOpen(false)}
                open={open}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        aria-label="basic tabs example"
                        onChange={handleChange}
                        value={value}>
                        <Tab label="Semua" {...a11yProps(0)} />
                        <Tab label="Saldo Masuk" {...a11yProps(1)} />

                        {isAuthHasPermission(Mart.READ_SALE_REPORT) && (
                            <Tab label="Rincian Marjin" {...a11yProps(2)} />
                        )}
                    </Tabs>
                </Box>
                <CustomTabPanel index={0} value={value}>
                    <Datatable />
                </CustomTabPanel>
                <CustomTabPanel index={1} value={value}>
                    <Box p={4}>
                        <BalanceInSummary />
                    </Box>
                </CustomTabPanel>

                {isAuthHasPermission(Mart.READ_SALE_REPORT) && (
                    <CustomTabPanel index={2} value={value}>
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
            aria-labelledby={`tab-${index}`}
            hidden={value !== index}
            id={`tabpanel-${index}`}
            role="tabpanel"
            {...other}>
            {value === index && <Box>{children}</Box>}
        </div>
    )
}

function a11yProps(index: number) {
    return {
        'aria-controls': `tabpanel-${index}`,
        id: `tab-${index}`,
    }
}
