import { FC, useState } from 'react'

import TopBar from './TopBar'
import MenuList from './MenuList'

const TopBarAndMenuList: FC<{
    title: string
}> = ({ title }) => {
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
