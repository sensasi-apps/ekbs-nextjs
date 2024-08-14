import dynamic from 'next/dynamic'
import ChipSmall from '@/components/ChipSmall'
import TextField from '@/components/TextField'
import SearchIcon from '@mui/icons-material/Search'
import { Masonry } from '@mui/lab'
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Paper,
    Typography,
} from '@mui/material'

const InputAdornment = dynamic(() => import('@mui/material/InputAdornment'))

export default function ProductPicker() {
    return (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
            }}>
            <TextField
                placeholder="Nama / Kode / Kategori"
                name="product-search"
                margin="none"
                required={false}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon fontSize="small" color="disabled" />
                        </InputAdornment>
                    ),
                }}
            />

            <Box display="flex" justifyContent="center">
                <Masonry columns={3} spacing={2}>
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                    <ProductCard />
                </Masonry>
            </Box>
        </Paper>
    )
}

function ProductCard() {
    return (
        <Card
            component="span"
            variant="outlined"
            sx={{
                borderRadius: 4,
            }}>
            <CardActionArea>
                <CardContent
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                    }}>
                    <div>
                        <ChipSmall
                            component="div"
                            label="Kudapan"
                            variant="outlined"
                        />

                        <Typography
                            mt={1}
                            component="div"
                            variant="caption"
                            color="text.disabled">
                            #1 / 12834628
                        </Typography>
                    </div>

                    <Typography>Good Day Freeze Cookies n Cream</Typography>

                    <div>
                        <Typography
                            variant="h5"
                            component="div"
                            color="success.main">
                            Rp. 100.000
                        </Typography>
                        <Typography color="text.disabled" variant="overline">
                            / Botol
                        </Typography>
                    </div>

                    <Typography variant="body2" color="text.disabled">
                        well meaning and kindly.
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
