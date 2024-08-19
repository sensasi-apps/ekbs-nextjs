import ChipSmall from '@/components/ChipSmall'
import {
    Box,
    Divider,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
} from '@mui/material'
import { memo } from 'react'

function SaleList() {
    return (
        <Paper>
            <Box px={2} pt={3} display="flex" gap={0.5}>
                <ChipSmall label="Fisik" variant="filled" color="success" />
                <ChipSmall label="Transfer" variant="outlined" />
            </Box>

            <List>
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
                <MyListItem />
            </List>
        </Paper>
    )
}

export default memo(SaleList)

function MyListItem() {
    return (
        <>
            <ListItemButton>
                <ListItemText
                    disableTypography
                    primary={
                        <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            textOverflow="ellipsis"
                            whiteSpace="nowrap">
                            <ChipSmall
                                label="Fisik"
                                variant="outlined"
                                color="success"
                            />
                            <Typography variant="h6">Rp 120.000.000</Typography>
                        </Box>
                    }
                    secondary={
                        <Box>
                            <Typography
                                variant="overline"
                                color="text.disabled"
                                lineHeight="unset"
                                mt={1}
                                mb={0.25}
                                component="div">
                                #12312312 &mdash; Mr. Y
                            </Typography>

                            <Typography
                                variant="overline"
                                lineHeight="unset"
                                color="text.disabled"
                                component="div">
                                14-08-2024 12:34:56
                            </Typography>
                        </Box>
                    }
                />
            </ListItemButton>

            <Divider variant="middle" component="li" />
        </>
    )
}
