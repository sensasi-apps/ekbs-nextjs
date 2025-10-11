// vendors

// icons
import AddCircleIcon from '@mui/icons-material/AddCircle'
// materials
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea, {
    type CardActionAreaProps,
} from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import Zoom from '@mui/material/Zoom'
import { useFormikContext } from 'formik'
import { memo } from 'react'
import ChipSmall from '@/components/ChipSmall'
// components
import type Product from '@/modules/mart/types/orms/product'
import formatNumber from '@/utils/format-number'
// utils
import numberToCurrency from '@/utils/number-to-currency'
import type { FormikStatusType } from '../../formik-wrapper'

function ProductCard({
    qty,
    defaultSellPrice,
    data: {
        id,
        code,
        name,
        barcode_reg_id,
        description,
        category_name,
        unit,
        deleted_at,
        is_in_opname,
    },
    searchText,
    onClick,
}: {
    qty: number
    defaultSellPrice: number
    data: Product & {
        is_in_opname: boolean
    }
    searchText: string
    onClick: CardActionAreaProps['onClick']
}) {
    const { status } = useFormikContext()
    const typedStatus = status as FormikStatusType

    const isDisabled =
        !typedStatus?.isFormOpen ||
        !!deleted_at ||
        typedStatus.isDisabled ||
        qty <= 0 ||
        is_in_opname

    return (
        <Zoom in>
            <Card
                component="span"
                elevation={0}
                sx={{
                    borderRadius: 4,
                    textDecoration: deleted_at ? 'line-through' : 'none',
                }}
                variant={isDisabled ? 'elevation' : 'outlined'}>
                <CardActionArea disabled={isDisabled} onClick={onClick}>
                    <CardContent
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                        }}>
                        {is_in_opname && (
                            <ChipSmall
                                color="warning"
                                component="div"
                                label="OPNAME"
                                variant="filled"
                            />
                        )}

                        {qty <= 0 && (
                            <ChipSmall
                                color="error"
                                component="div"
                                label="KOSONG"
                                variant="filled"
                            />
                        )}

                        <Box
                            display="flex"
                            gap={1}
                            justifyContent="space-between">
                            <ChipSmall
                                label={category_name ?? 'Tanpa Kategori'}
                                variant="outlined"
                            />

                            <Fade in={!isDisabled}>
                                <AddCircleIcon color="success" />
                            </Fade>
                        </Box>

                        <Typography
                            color="text.disabled"
                            component="div"
                            variant="caption">
                            #{getHighlightedText(id.toString(), searchText)}
                            {code ? (
                                <>
                                    {' / '}
                                    {getHighlightedText(code, searchText)}
                                </>
                            ) : (
                                ''
                            )}
                            {barcode_reg_id ? (
                                <>
                                    {' / '}
                                    {getHighlightedText(
                                        barcode_reg_id,
                                        searchText,
                                    )}
                                </>
                            ) : (
                                ''
                            )}
                        </Typography>

                        <Typography component="div">
                            {getHighlightedText(name, searchText)}

                            <Typography
                                color="text.disabled"
                                component="span"
                                mt={-1}
                                sx={{
                                    verticalAlign: 'middle',
                                }}
                                variant="caption">
                                {' '}
                                {formatNumber(qty)}
                            </Typography>
                        </Typography>

                        <Typography
                            color="success.main"
                            component="div"
                            variant="h5">
                            {numberToCurrency(defaultSellPrice)}
                        </Typography>

                        <Typography
                            color="text.disabled"
                            mt={-1}
                            variant="overline">
                            / {unit}
                        </Typography>

                        {description && (
                            <Typography color="text.disabled" variant="body2">
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

function getHighlightedText(text: string, highlight: string) {
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))

    return (
        <>
            {parts.map((part, i) => (
                <Box
                    color={
                        part.toLowerCase() === highlight.toLowerCase()
                            ? 'warning.main'
                            : undefined
                    }
                    component="span"
                    key={i}>
                    {part}
                </Box>
            ))}
        </>
    )
}
