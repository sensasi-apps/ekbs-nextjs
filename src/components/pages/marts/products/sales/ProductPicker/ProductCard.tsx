import type Product from '@/dataTypes/mart/Product'
import { memo } from 'react'
import {
    Box,
    Card,
    CardActionArea,
    CardActionAreaProps,
    CardContent,
    Fade,
    Typography,
    Zoom,
} from '@mui/material'
// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// components
import ChipSmall from '@/components/ChipSmall'
// utils
import numberToCurrency from '@/utils/numberToCurrency'
import { useFormikContext } from 'formik'
import { FormikStatusType } from '../FormikComponent'

const WAREHOUSE = 'main'

function ProductCard({
    data: {
        id,
        code,
        name,
        description,
        category_name,
        unit,
        warehouses,
        deleted_at,
    },
    onClick,
}: {
    data: Product
    onClick: CardActionAreaProps['onClick']
}) {
    const { status } = useFormikContext()
    const typedStatus = status as FormikStatusType

    const { default_sell_price } =
        warehouses.find(warehouse => warehouse.warehouse === WAREHOUSE) ?? {}

    return (
        <Zoom in>
            <Card
                component="span"
                variant="outlined"
                sx={{
                    borderRadius: 4,
                    textDecoration: deleted_at ? 'line-through' : 'none',
                }}>
                <CardActionArea
                    onClick={onClick}
                    disabled={!typedStatus?.isFormOpen || !!deleted_at}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                        <Box display="flex" justifyContent="space-between">
                            <ChipSmall
                                component="div"
                                label={category_name ?? 'Tanpa Kategori'}
                                variant="outlined"
                            />

                            <Fade in={typedStatus?.isFormOpen}>
                                <AddCircleIcon color="success" />
                            </Fade>
                        </Box>

                        <Typography
                            component="div"
                            variant="caption"
                            color="text.disabled">
                            #{id}
                            {code ? ` / ${code}` : ''}
                        </Typography>

                        <Typography>{name}</Typography>

                        <Typography
                            variant="h5"
                            component="div"
                            color="success.main">
                            {numberToCurrency(default_sell_price ?? 0)}
                        </Typography>

                        <Typography
                            mt={-1}
                            color="text.disabled"
                            variant="overline">
                            / {unit}
                        </Typography>

                        {description && (
                            <Typography variant="body2" color="text.disabled">
                                {description}
                            </Typography>
                        )}
                    </CardContent>
                </CardActionArea>
            </Card>
        </Zoom>
    )
}

export default memo(ProductCard)
