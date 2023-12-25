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
    renderOption,
    dataKey = 'uuid',
    ...rest
}: {
    endpoint: string
    label?: string
    selectProps?: Omit<SelectProps, 'onChange' | 'label'>
    helperText?: ReactNode
    renderOption?: (option: any) => JSX.Element
    onChange?: (event: SelectChangeEvent<unknown>) => void
    onValueChange?: (value: any) => any // TODO: remove any
    dataKey?: string
} & FormControlProps) {
    const { data = [], isLoading } = useSWR<any[]>(endpoint)

    const handleChange = (event: SelectChangeEvent<unknown>) => {
        const value = event.target.value

        onChange?.(event)

        onValueChange(
            data.find((item: any) => (item[dataKey] ?? item.id) === value),
        )
    }

    return (
        <FormControl
            fullWidth
            {...rest}
            error={rest.error || data.length === 0}>
            {isLoading ? (
                <Skeleton height="2.5em" variant="rounded" />
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
                        error={rest?.error || data.length === 0}
                        onChange={handleChange}
                        label={label}>
                        {data.map(
                            renderOption ??
                                ((item: any) => (
                                    <MenuItem
                                        key={item[dataKey] ?? item.id}
                                        value={item[dataKey] ?? item.id}>
                                        {item.name}
                                    </MenuItem>
                                )),
                        )}
                    </Select>

                    {!isLoading && data.length === 0 && (
                        <FormHelperText>Tidak ada data</FormHelperText>
                    )}

                    {helperText && (
                        <FormHelperText>{helperText}</FormHelperText>
                    )}
                </>
            )}
        </FormControl>
    )
}
