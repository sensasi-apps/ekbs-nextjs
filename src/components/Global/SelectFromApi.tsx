// types
import type { ReactNode } from 'react'
import type { SelectChangeEvent, SelectProps } from '@mui/material/Select'
import type { FormControlProps } from '@mui/material/FormControl'
// vendors
import useSWR from 'swr'
// materials
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Skeleton from '@mui/material/Skeleton'

export default function SelectFromApi({
    endpoint,
    helperText,
    label,
    selectProps,
    onChange,
    onValueChange = () => {},
    ...rest
}: {
    endpoint: string
    label?: string
    selectProps?: Omit<SelectProps, 'onChange' | 'label'>
    helperText?: ReactNode
    onChange?: (event: SelectChangeEvent<unknown>) => void
    onValueChange?: (value: any) => any // TODO: remove any
} & FormControlProps) {
    const { data, isLoading } = useSWR(endpoint)

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value

        onChange?.(event)

        onValueChange(
            data.find((item: any) => (item.uuid || item.id) === value),
        )
    }

    return (
        <FormControl fullWidth {...rest}>
            {isLoading ? (
                <Skeleton height="2.5em" />
            ) : (
                <>
                    {label && (
                        <InputLabel shrink={selectProps?.displayEmpty}>
                            {label}
                        </InputLabel>
                    )}
                    <Select
                        {...(rest as SelectProps)}
                        {...selectProps}
                        onChange={handleChange}
                        label={label}>
                        {data?.map((item: any) => (
                            <MenuItem
                                key={item.uuid || item.id}
                                value={item.uuid || item.id}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </Select>

                    {helperText && (
                        <FormHelperText>{helperText}</FormHelperText>
                    )}
                </>
            )}
        </FormControl>
    )
}
