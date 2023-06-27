import { useState } from 'react'

import TopBar from './TopBar'
import MenuList from './MenuList'

function TopBarAndMenuList({ title }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

    return (
        <>
            <TopBar title={title} toggleDrawer={toggleDrawer} />
            <MenuList isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </>
    )
}

export default TopBarAndMenuList
