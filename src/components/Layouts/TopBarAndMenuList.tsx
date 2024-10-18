import { useState, memo } from 'react'

import TopBar from './components/TopBar'
import MenuList from './components/menu-list'

const TopBarAndMenuList = memo(function TopBarAndMenuList({
    title,
}: {
    title: string
}) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const toggleDrawer = () => setIsDrawerOpen(prev => !prev)

    return (
        <>
            <TopBar title={title} toggleDrawer={toggleDrawer} />
            <MenuList isDrawerOpen={isDrawerOpen} toggleDrawer={toggleDrawer} />
        </>
    )
})

export default TopBarAndMenuList
